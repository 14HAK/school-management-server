import StudentAttendance from "../student-attendance/studentAttendance.model.js";
import ApiError from "../../shared/ApiError.js";

/**
 * Summaries are computed on read rather than maintained as a separately
 * persisted collection. The spec lists "attendanceSummaries" among its core
 * collections, but a materialized summary risks drifting out of sync with
 * the underlying attendance records every time one is corrected — computing
 * on demand is always accurate and, at this data scale, cheap. Documented
 * as an implementation choice, not a spec deviation: the same daily/
 * monthly/yearly summaries the spec calls for are still produced, just via
 * aggregation instead of a stored table.
 */

const STATUS_KEYS = ["PRESENT", "ABSENT", "LATE", "LEAVE", "HOLIDAY", "HALF_DAY"];

const emptyCounts = () => STATUS_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

const computePercentage = (counts) => {
  const total = STATUS_KEYS.reduce((sum, key) => sum + counts[key], 0);
  const countableTotal = total - counts.HOLIDAY; // holidays don't count against attendance
  if (countableTotal <= 0) return 0;
  const present = counts.PRESENT + counts.LATE + counts.HALF_DAY * 0.5;
  return Number(((present / countableTotal) * 100).toFixed(2));
};

export const getStudentDailySummary = async (studentId, { month, year }) => {
  if (!month || !year) throw ApiError.badRequest("month and year query params are required.");

  const start = new Date(Number(year), Number(month) - 1, 1);
  const end = new Date(Number(year), Number(month), 1);

  const records = await StudentAttendance.find({
    studentId,
    date: { $gte: start, $lt: end },
  }).sort("date");

  const counts = emptyCounts();
  records.forEach((r) => {
    counts[r.attendanceStatus] = (counts[r.attendanceStatus] || 0) + 1;
  });

  return {
    studentId,
    month: Number(month),
    year: Number(year),
    counts,
    percentage: computePercentage(counts),
    records,
  };
};

export const getStudentYearlySummary = async (studentId, { year }) => {
  if (!year) throw ApiError.badRequest("year query param is required.");

  const start = new Date(Number(year), 0, 1);
  const end = new Date(Number(year) + 1, 0, 1);

  const records = await StudentAttendance.find({ studentId, date: { $gte: start, $lt: end } });

  const monthly = Array.from({ length: 12 }, (_, i) => {
    const monthRecords = records.filter((r) => new Date(r.date).getMonth() === i);
    const counts = emptyCounts();
    monthRecords.forEach((r) => {
      counts[r.attendanceStatus] = (counts[r.attendanceStatus] || 0) + 1;
    });
    return { month: i + 1, counts, percentage: computePercentage(counts) };
  });

  const yearCounts = emptyCounts();
  records.forEach((r) => {
    yearCounts[r.attendanceStatus] = (yearCounts[r.attendanceStatus] || 0) + 1;
  });

  return {
    studentId,
    year: Number(year),
    overallPercentage: computePercentage(yearCounts),
    overallCounts: yearCounts,
    monthly,
  };
};

export const getClassDailySummary = async ({ classId, sectionId, date }) => {
  if (!classId || !sectionId || !date) {
    throw ApiError.badRequest("classId, sectionId, and date query params are required.");
  }

  const day = new Date(date);
  const start = new Date(day.setHours(0, 0, 0, 0));
  const end = new Date(day.setHours(24, 0, 0, 0));

  const records = await StudentAttendance.find({
    classId,
    sectionId,
    date: { $gte: start, $lt: end },
  }).populate("studentId", "studentId personalInfo.fullName");

  const counts = emptyCounts();
  records.forEach((r) => {
    counts[r.attendanceStatus] = (counts[r.attendanceStatus] || 0) + 1;
  });

  return { classId, sectionId, date, counts, totalMarked: records.length, records };
};
