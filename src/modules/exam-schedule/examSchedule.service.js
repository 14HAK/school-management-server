import ExamSchedule from "./examSchedule.model.js";
import ExamInvigilator from "./examInvigilator.model.js";
import ApiError from "../../shared/ApiError.js";

const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

/** Two HH:mm ranges overlap if start1 < end2 && start2 < end1 (lexicographic compare works for zero-padded 24hr strings). */
const timesOverlap = (start1, end1, start2, end2) => start1 < end2 && start2 < end1;

const assertNoRoomConflict = async ({ roomId, examDate, startTime, endTime }, excludeId) => {
  const filter = { roomId, isDeleted: false };
  if (excludeId) filter._id = { $ne: excludeId };

  const candidates = await ExamSchedule.find(filter);
  const conflict = candidates.find(
    (s) => sameDay(s.examDate, examDate) && timesOverlap(s.startTime, s.endTime, startTime, endTime)
  );
  if (conflict) {
    throw ApiError.conflict("This room is already booked for another exam at an overlapping time.");
  }
};

export const createSchedule = async (payload) => {
  await assertNoRoomConflict(payload);

  const duplicate = await ExamSchedule.findOne({
    examId: payload.examId,
    classId: payload.classId,
    sectionId: payload.sectionId,
    groupId: payload.groupId || null,
    subjectId: payload.subjectId,
    isDeleted: false,
  });
  if (duplicate) {
    throw ApiError.conflict("This subject already has an exam schedule for this exam/class/section.");
  }

  return ExamSchedule.create(payload);
};

const populateAll = (query) =>
  query
    .populate("examId", "examName examType status")
    .populate("classId", "name level")
    .populate("sectionId", "name")
    .populate("groupId", "name")
    .populate("subjectId", "subjectName subjectCode")
    .populate("roomId", "buildingName roomNumber");

export const listSchedules = async ({ page, limit, examId, classId, sectionId, status, sort }) => {
  const filter = { isDeleted: false };
  if (examId) filter.examId = examId;
  if (classId) filter.classId = classId;
  if (sectionId) filter.sectionId = sectionId;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    populateAll(ExamSchedule.find(filter))
      .sort(sort || "examDate startTime")
      .skip((page - 1) * limit)
      .limit(limit),
    ExamSchedule.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getScheduleById = async (id) => {
  const schedule = await populateAll(ExamSchedule.findOne({ _id: id, isDeleted: false }));
  if (!schedule) throw ApiError.notFound("Exam schedule not found.");

  const invigilators = await ExamInvigilator.find({ examScheduleId: id }).populate(
    "teacherId",
    "employeeId personalInfo.fullName"
  );

  return { ...schedule.toObject(), invigilators };
};

export const updateSchedule = async (id, updates) => {
  const schedule = await ExamSchedule.findOne({ _id: id, isDeleted: false });
  if (!schedule) throw ApiError.notFound("Exam schedule not found.");

  if (updates.roomId || updates.examDate || updates.startTime || updates.endTime) {
    await assertNoRoomConflict(
      {
        roomId: updates.roomId || schedule.roomId,
        examDate: updates.examDate || schedule.examDate,
        startTime: updates.startTime || schedule.startTime,
        endTime: updates.endTime || schedule.endTime,
      },
      id
    );
  }

  Object.assign(schedule, updates);
  await schedule.save();
  return schedule;
};

export const deleteSchedule = async (id) => {
  const schedule = await ExamSchedule.findOne({ _id: id, isDeleted: false });
  if (!schedule) throw ApiError.notFound("Exam schedule not found.");

  schedule.isDeleted = true;
  await schedule.save();
  await ExamInvigilator.deleteMany({ examScheduleId: id });
};

/** One teacher cannot invigilate two exam rooms at the same time, per spec. */
export const addInvigilator = async (examScheduleId, { teacherId, role }) => {
  const schedule = await ExamSchedule.findOne({ _id: examScheduleId, isDeleted: false });
  if (!schedule) throw ApiError.notFound("Exam schedule not found.");

  const existingAssignments = await ExamInvigilator.find({ teacherId, status: { $ne: "CANCELLED" } }).populate(
    "examScheduleId",
    "examDate startTime endTime"
  );

  const conflict = existingAssignments.find(
    (a) =>
      a.examScheduleId &&
      sameDay(a.examScheduleId.examDate, schedule.examDate) &&
      timesOverlap(a.examScheduleId.startTime, a.examScheduleId.endTime, schedule.startTime, schedule.endTime)
  );
  if (conflict) {
    throw ApiError.conflict("This teacher is already invigilating another exam at an overlapping time.");
  }

  try {
    return await ExamInvigilator.create({ examScheduleId, teacherId, role });
  } catch (err) {
    if (err.code === 11000) {
      throw ApiError.conflict("This teacher is already assigned as an invigilator for this schedule.");
    }
    throw err;
  }
};

export const removeInvigilator = async (examScheduleId, invigilatorId) => {
  const result = await ExamInvigilator.findOneAndDelete({
    _id: invigilatorId,
    examScheduleId,
  });
  if (!result) throw ApiError.notFound("Invigilator assignment not found.");
};
