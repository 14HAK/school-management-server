import StaffAttendance from "./staffAttendance.model.js";
import ApiError from "../../shared/ApiError.js";

const assertNotLocked = (record) => {
  if (record.status === "LOCKED") {
    throw ApiError.badRequest("This attendance record is locked and cannot be modified.");
  }
};

export const createAttendance = async (payload, markedBy) => {
  try {
    return await StaffAttendance.create({ ...payload, markedBy });
  } catch (err) {
    if (err.code === 11000) {
      throw ApiError.conflict("Attendance has already been marked for this staff member on this date.");
    }
    throw err;
  }
};

const populateAll = (query) =>
  query.populate("staffId", "employeeId personalInfo.fullName designation").populate("markedBy", "email");

export const listAttendance = async ({ page, limit, staffId, date, startDate, endDate, status, sort }) => {
  const filter = {};
  if (staffId) filter.staffId = staffId;
  if (status) filter.status = status;
  if (date) {
    const day = new Date(date);
    filter.date = { $gte: new Date(day.setHours(0, 0, 0, 0)), $lt: new Date(day.setHours(24, 0, 0, 0)) };
  } else if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const [data, total] = await Promise.all([
    populateAll(StaffAttendance.find(filter))
      .sort(sort || "-date")
      .skip((page - 1) * limit)
      .limit(limit),
    StaffAttendance.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getAttendanceById = async (id) => {
  const record = await populateAll(StaffAttendance.findById(id));
  if (!record) throw ApiError.notFound("Attendance record not found.");
  return record;
};

export const updateAttendance = async (id, updates) => {
  const record = await StaffAttendance.findById(id);
  if (!record) throw ApiError.notFound("Attendance record not found.");
  assertNotLocked(record);

  Object.assign(record, updates);
  await record.save();
  return record;
};

export const deleteAttendance = async (id) => {
  const record = await StaffAttendance.findById(id);
  if (!record) throw ApiError.notFound("Attendance record not found.");
  assertNotLocked(record);

  await record.deleteOne();
};
