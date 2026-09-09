import ExamResult from "./examResult.model.js";
import ExamSchedule from "../exam-schedule/examSchedule.model.js";
import ExamMark from "../exam-mark/examMark.model.js";
import StudentEnrollment from "../student-enrollment/studentEnrollment.model.js";
import Exam from "../exam/exam.model.js";
import ApiError from "../../shared/ApiError.js";
import { percentageToGrade, FAIL_GRADE } from "./grading.util.js";

/**
 * Generate Result — per spec's workflow, aggregates every ExamMark a
 * student has across all schedules for this exam/class/section/(group),
 * computes total/obtained/percentage/grade/gpa, then ranks the cohort by
 * obtained marks (dense ranking — ties share a position, per common
 * practice; the spec doesn't specify tie-breaking so this is documented).
 */
export const generateResults = async ({ examId, classId, sectionId, groupId }) => {
  const exam = await Exam.findOne({ _id: examId, isDeleted: false });
  if (!exam) throw ApiError.notFound("Exam not found.");

  const scheduleFilter = { examId, classId, sectionId, isDeleted: false };
  if (groupId) scheduleFilter.groupId = groupId;
  const schedules = await ExamSchedule.find(scheduleFilter);

  if (schedules.length === 0) {
    throw ApiError.badRequest("No exam schedules found for this scope. Create schedules first.");
  }

  const totalMarks = schedules.reduce((sum, s) => sum + s.fullMarks, 0);
  const scheduleIds = schedules.map((s) => s._id);

  const enrollmentFilter = {
    classId,
    sectionId,
    academicYearId: exam.academicYearId,
    status: "ACTIVE",
    isDeleted: false,
  };
  if (groupId) enrollmentFilter.groupId = groupId;
  const enrollments = await StudentEnrollment.find(enrollmentFilter);

  if (enrollments.length === 0) {
    throw ApiError.badRequest("No active students enrolled in this class/section/group.");
  }

  const allMarks = await ExamMark.find({ examScheduleId: { $in: scheduleIds } });

  const computed = [];
  const skipped = [];

  for (const enrollment of enrollments) {
    const studentId = enrollment.studentId;
    const studentMarks = allMarks.filter((m) => String(m.studentId) === String(studentId));

    if (studentMarks.length < schedules.length) {
      skipped.push({ studentId, reason: "Marks not fully entered for all subjects." });
      continue;
    }

    const obtainedMarks = studentMarks.reduce((sum, m) => sum + m.obtainedMarks, 0);
    const percentage = Number(((obtainedMarks / totalMarks) * 100).toFixed(2));

    const failedAnySubject = studentMarks.some((m) => {
      const schedule = schedules.find((s) => String(s._id) === String(m.examScheduleId));
      return schedule && m.obtainedMarks < schedule.passMarks;
    });

    const { grade, gpa } = failedAnySubject ? FAIL_GRADE : percentageToGrade(percentage);

    computed.push({ studentId, totalMarks, obtainedMarks, percentage, grade, gpa });
  }

  // Dense ranking by obtainedMarks descending.
  const sorted = [...computed].sort((a, b) => b.obtainedMarks - a.obtainedMarks);
  const positionMap = new Map();
  let currentPosition = 0;
  let lastMarks = null;
  for (const entry of sorted) {
    if (entry.obtainedMarks !== lastMarks) {
      currentPosition += 1;
      lastMarks = entry.obtainedMarks;
    }
    positionMap.set(String(entry.studentId), currentPosition);
  }

  const results = [];
  for (const entry of computed) {
    const result = await ExamResult.findOneAndUpdate(
      { examId, studentId: entry.studentId },
      {
        $set: {
          totalMarks: entry.totalMarks,
          obtainedMarks: entry.obtainedMarks,
          percentage: entry.percentage,
          grade: entry.grade,
          gpa: entry.gpa,
          position: positionMap.get(String(entry.studentId)),
          status: "DRAFT",
        },
      },
      { upsert: true, new: true }
    );
    results.push(result);
  }

  return { generated: results.length, skipped };
};

/** Publish — per spec: "Published Results cannot be modified." */
export const publishResults = async ({ examId }) => {
  const exam = await Exam.findOne({ _id: examId, isDeleted: false });
  if (!exam) throw ApiError.notFound("Exam not found.");

  const result = await ExamResult.updateMany(
    { examId, status: "DRAFT" },
    { status: "PUBLISHED", publishedAt: new Date() }
  );

  exam.status = "PUBLISHED";
  await exam.save();

  return { published: result.modifiedCount };
};

export const getResultsByStudent = (studentId) =>
  ExamResult.find({ studentId })
    .populate("examId", "examName examType startDate endDate")
    .sort("-createdAt");
