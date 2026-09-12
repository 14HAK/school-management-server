import StudentAttendance from "./studentAttendance.model.js";
import StudentEnrollment from "../student-enrollment/studentEnrollment.model.js";
import ApiError from "../../shared/ApiError.js";

/** Attendance can only be marked for an actively enrolled student, per spec. */
const assertActiveEnrollment = async ({ studentId, classId, sectionId, academicYearId }) => {
  const enrollment = await StudentEnrollment.findOne({
    studentId,
    classId,
    sectionId,
    academicYearId,
    status: "ACTIVE",
    isDeleted: false,
  });
  if (!enrollment) {
    throw ApiError.badRequest("Student does not have an active enrollment for this class/section/year.");
  }
};

const assertNotLocked = (record) => {
  if (record.status === "LOCKED") {
    throw ApiError.badRequest("This attendance record is locked and cannot be modified.");
  }
};

export const createAttendance = async (payload, markedBy) => {
  await assertActiveEnrollment(payload);

  try {
    return await StudentAttendance.create({ ...payload, markedBy });
  } catch (err) {
    if (err.code === 11000) {
      throw ApiError.conflict("Attendance has already been marked for this student on this date.");
    }
    throw err;
  }
};

/** Bulk entry — mark a whole class/section in one request, matching the spec's actual workflow. */
export const bulkCreateAttendance = async (
  { academicYearId, classId, sectionId, groupId, date, entries },
  markedBy
) => {
  const results = { created: [], failed: [] };

  for (const entry of entries) {
    try {
      await assertActiveEnrollment({ studentId: entry.studentId, classId, sectionId, academicYearId });

      const record = await StudentAttendance.findOneAndUpdate(
        { studentId: entry.studentId, date },
        {
          $setOnInsert: {
            studentId: entry.studentId,
            academicYearId,
            classId,
            sectionId,
            groupId: groupId || null,
            date,
            markedBy,
          },
          $set: {
            attendanceStatus: entry.attendanceStatus,
            remarks: entry.remarks || null,
          },
        },
        { upsert: true, new: true, runValidators: true }
      );
      results.created.push(record);
    } catch (err) {
      results.failed.push({ studentId: entry.studentId, reason: err.message });
    }
  }

  return results;
};

const populateAll = (query) =>
  query
    .populate("studentId", "studentId personalInfo.fullName")
    .populate("classId", "name")
    .populate("sectionId", "name")
    .populate("markedBy", "email");

export const listAttendance = async ({
  page,
  limit,
  studentId,
  classId,
  sectionId,
  date,
  startDate,
  endDate,
  status,
  sort,
}) => {
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (classId) filter.classId = classId;
  if (sectionId) filter.sectionId = sectionId;
  if (status) filter.status = status;
  if (date) {
    const day = new Date(date);
    filter.date = { $gte: new Date(day.setHours(0, 0, 0, 0)), $lt: new Date(day.setHours(24, 0, 0, 0)) };
  } else if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const [data, total] = await Promise.all([
    populateAll(StudentAttendance.find(filter))
      .sort(sort || "-date")
      .skip((page - 1) * limit)
      .limit(limit),
    StudentAttendance.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getAttendanceById = async (id) => {
  const record = await populateAll(StudentAttendance.findById(id));
  if (!record) throw ApiError.notFound("Attendance record not found.");
  return record;
};

export const updateAttendance = async (id, updates) => {
  const record = await StudentAttendance.findById(id);
  if (!record) throw ApiError.notFound("Attendance record not found.");
  assertNotLocked(record);

  Object.assign(record, updates);
  await record.save();
  return record;
};

export const deleteAttendance = async (id) => {
  const record = await StudentAttendance.findById(id);
  if (!record) throw ApiError.notFound("Attendance record not found.");
  assertNotLocked(record);

  await record.deleteOne();
};
