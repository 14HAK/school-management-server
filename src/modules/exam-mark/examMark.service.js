import ExamMark from "./examMark.model.js";
import ExamSchedule from "../exam-schedule/examSchedule.model.js";
import StudentEnrollment from "../student-enrollment/studentEnrollment.model.js";
import ApiError from "../../shared/ApiError.js";

/** Marks entry only allowed once the exam schedule is finalized, per spec. */
const assertScheduleFinalized = (schedule) => {
  if (schedule.status === "DRAFT") {
    throw ApiError.badRequest("Exam Schedule must be finalized (not DRAFT) before marks entry.");
  }
};

const assertWithinFullMarks = (obtainedMarks, fullMarks) => {
  if (obtainedMarks > fullMarks) {
    throw ApiError.badRequest(`Marks cannot exceed full marks (${fullMarks}).`);
  }
};

/** Students must be enrolled before appearing in an exam, per spec. */
const assertStudentEnrolled = async (studentId, schedule) => {
  const enrollment = await StudentEnrollment.findOne({
    studentId,
    classId: schedule.classId,
    sectionId: schedule.sectionId,
    status: "ACTIVE",
    isDeleted: false,
  });
  if (!enrollment) {
    throw ApiError.badRequest("Student is not actively enrolled in this class/section.");
  }
};

const loadScheduleOrThrow = async (examScheduleId) => {
  const schedule = await ExamSchedule.findOne({ _id: examScheduleId, isDeleted: false });
  if (!schedule) throw ApiError.notFound("Exam schedule not found.");
  return schedule;
};

export const createMark = async ({ examScheduleId, studentId, obtainedMarks, remarks }, enteredBy) => {
  const schedule = await loadScheduleOrThrow(examScheduleId);
  assertScheduleFinalized(schedule);
  assertWithinFullMarks(obtainedMarks, schedule.fullMarks);
  await assertStudentEnrolled(studentId, schedule);

  try {
    return await ExamMark.create({ examScheduleId, studentId, obtainedMarks, remarks, enteredBy });
  } catch (err) {
    if (err.code === 11000) {
      throw ApiError.conflict("Marks have already been entered for this student on this schedule.");
    }
    throw err;
  }
};

/** Bulk entry — one full class's marks for a schedule in a single request. */
export const bulkCreateMarks = async ({ examScheduleId, marks }, enteredBy) => {
  const schedule = await loadScheduleOrThrow(examScheduleId);
  assertScheduleFinalized(schedule);

  const results = { created: [], failed: [] };

  for (const entry of marks) {
    try {
      assertWithinFullMarks(entry.obtainedMarks, schedule.fullMarks);
      await assertStudentEnrolled(entry.studentId, schedule);

      const mark = await ExamMark.findOneAndUpdate(
        { examScheduleId, studentId: entry.studentId },
        {
          $setOnInsert: {
            examScheduleId,
            studentId: entry.studentId,
            enteredBy,
          },
          $set: {
            obtainedMarks: entry.obtainedMarks,
            remarks: entry.remarks || null,
            enteredAt: new Date(),
          },
        },
        { upsert: true, new: true }
      );
      results.created.push(mark);
    } catch (err) {
      results.failed.push({ studentId: entry.studentId, reason: err.message });
    }
  }

  return results;
};

export const listMarks = async ({ page, limit, examScheduleId, studentId }) => {
  const filter = {};
  if (examScheduleId) filter.examScheduleId = examScheduleId;
  if (studentId) filter.studentId = studentId;

  const [data, total] = await Promise.all([
    ExamMark.find(filter)
      .populate("studentId", "studentId personalInfo.fullName")
      .populate("examScheduleId", "examDate fullMarks passMarks")
      .sort("-enteredAt")
      .skip((page - 1) * limit)
      .limit(limit),
    ExamMark.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

/** Corrections append a revision entry rather than silently overwriting, per spec. */
export const updateMark = async (id, { obtainedMarks, remarks, reason }, changedBy) => {
  const mark = await ExamMark.findById(id);
  if (!mark) throw ApiError.notFound("Mark entry not found.");

  const schedule = await loadScheduleOrThrow(mark.examScheduleId);
  assertWithinFullMarks(obtainedMarks, schedule.fullMarks);

  mark.revisions.push({ previousMarks: mark.obtainedMarks, changedBy, reason });
  mark.obtainedMarks = obtainedMarks;
  if (remarks !== undefined) mark.remarks = remarks;
  await mark.save();

  return mark;
};
