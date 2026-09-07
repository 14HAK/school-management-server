import ClassRoutine, { ROUTINE_WORKING_DAYS } from "./classRoutine.model.js";
import Class from "../class/class.model.js";
import Period from "../period/period.model.js";
import TeacherAssignment from "../teacher-assignment/teacherAssignment.model.js";
import ApiError from "../../shared/ApiError.js";
import { detectConflicts } from "./classRoutine.conflicts.js";

const assertGroupRule = async (classId, groupId) => {
  const klass = await Class.findById(classId);
  if (!klass) throw ApiError.badRequest("Class not found.");
  if (klass.hasGroups && !groupId) {
    throw ApiError.badRequest(`Group is required for ${klass.name}.`);
  }
  if (!klass.hasGroups && groupId) {
    throw ApiError.badRequest(`${klass.name} does not use groups.`);
  }
  return klass;
};

/** Only assigned teachers can teach assigned subjects, per spec's Routine Rules. */
const assertValidTeacherAssignment = async ({ teacherId, academicYearId, classId, sectionId, subjectId }) => {
  const assignment = await TeacherAssignment.findOne({
    teacherId,
    academicYearId,
    classId,
    sectionId,
    subjectId,
    isDeleted: false,
    status: "ACTIVE",
  });
  if (!assignment) {
    throw ApiError.badRequest(
      "This teacher is not assigned to teach this subject for this class and section."
    );
  }
};

const duplicateErrorToApiError = (err) => {
  if (err.code === 11000) {
    const key = Object.keys(err.keyPattern || {});
    if (key.includes("teacherId")) {
      return ApiError.conflict("This teacher already has a class scheduled in this period.");
    }
    if (key.includes("roomId")) {
      return ApiError.conflict("This room is already booked for this period.");
    }
    return ApiError.conflict("This class/section already has a subject scheduled in this period.");
  }
  return err;
};

export const createRoutineEntry = async (payload) => {
  await assertGroupRule(payload.classId, payload.groupId);
  await assertValidTeacherAssignment(payload);

  try {
    return await ClassRoutine.create(payload);
  } catch (err) {
    throw duplicateErrorToApiError(err);
  }
};

const populateAll = (query) =>
  query
    .populate("academicYearId", "year")
    .populate("classId", "name level")
    .populate("sectionId", "name")
    .populate("groupId", "name")
    .populate("subjectId", "subjectName subjectCode")
    .populate("teacherId", "employeeId personalInfo.fullName")
    .populate("roomId", "buildingName roomNumber");

export const listRoutineEntries = async ({
  page,
  limit,
  academicYearId,
  classId,
  sectionId,
  groupId,
  day,
  status,
  sort,
}) => {
  const filter = { isDeleted: false };
  if (academicYearId) filter.academicYearId = academicYearId;
  if (classId) filter.classId = classId;
  if (sectionId) filter.sectionId = sectionId;
  if (groupId) filter.groupId = groupId;
  if (day) filter.day = day;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    populateAll(ClassRoutine.find(filter))
      .sort(sort || "day period")
      .skip((page - 1) * limit)
      .limit(limit),
    ClassRoutine.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getRoutineEntryById = async (id) => {
  const entry = await populateAll(ClassRoutine.findOne({ _id: id, isDeleted: false }));
  if (!entry) throw ApiError.notFound("Routine entry not found.");
  return entry;
};

/** Per spec: once LOCKED, no modification unless unlocked first. */
const assertNotLocked = (entry) => {
  if (entry.status === "LOCKED") {
    throw ApiError.badRequest("This routine is locked. Unlock it before making changes.");
  }
};

export const updateRoutineEntry = async (id, updates) => {
  const entry = await ClassRoutine.findOne({ _id: id, isDeleted: false });
  if (!entry) throw ApiError.notFound("Routine entry not found.");
  assertNotLocked(entry);

  if (updates.teacherId || updates.subjectId) {
    await assertValidTeacherAssignment({
      teacherId: updates.teacherId || entry.teacherId,
      academicYearId: entry.academicYearId,
      classId: entry.classId,
      sectionId: entry.sectionId,
      subjectId: updates.subjectId || entry.subjectId,
    });
  }

  Object.assign(entry, updates);
  try {
    await entry.save();
  } catch (err) {
    throw duplicateErrorToApiError(err);
  }
  return entry;
};

export const deleteRoutineEntry = async (id) => {
  const entry = await ClassRoutine.findOne({ _id: id, isDeleted: false });
  if (!entry) throw ApiError.notFound("Routine entry not found.");
  assertNotLocked(entry);

  entry.isDeleted = true;
  await entry.save();
};

export const listRoutineByClass = (classId) =>
  populateAll(ClassRoutine.find({ classId, isDeleted: false })).sort("day period");

export const listRoutineByTeacher = (teacherId) =>
  populateAll(ClassRoutine.find({ teacherId, isDeleted: false })).sort("day period");

export const listRoutineByRoom = (roomId) =>
  populateAll(ClassRoutine.find({ roomId, isDeleted: false })).sort("day period");

/**
 * Automatic Routine Generation — per spec's "Auto Routine Rules": considers
 * Teacher Availability, Subject Assignment, Room Availability, Working Days,
 * Period Limits, Section, Group.
 *
 * This is intentionally a straightforward greedy scheduler (spec explicitly
 * lists "AI Based Routine Generator" as Future Scope — this is the v1
 * baseline, not that): for every active TeacherAssignment in the given
 * class/section/(group), it places one weekly period per subject into the
 * first day+period slot where the class, that teacher, and the given room
 * are all free. It fills DRAFT entries only — nothing is published
 * automatically, per the spec's "cannot be published until all conflicts
 * are resolved" rule.
 */
export const generateRoutine = async ({ academicYearId, classId, sectionId, groupId, roomId, days }) => {
  await assertGroupRule(classId, groupId);

  const assignmentFilter = {
    academicYearId,
    classId,
    sectionId,
    isDeleted: false,
    status: "ACTIVE",
  };
  const assignments = await TeacherAssignment.find(assignmentFilter);
  if (assignments.length === 0) {
    throw ApiError.badRequest(
      "No active teacher assignments found for this class/section. Create assignments first."
    );
  }

  const periods = await Period.find({ isBreak: false, status: "ACTIVE" }).sort("periodNumber");
  if (periods.length === 0) {
    throw ApiError.badRequest("No periods configured. Run the period seed script first.");
  }

  const workingDays = days && days.length > 0 ? days : ROUTINE_WORKING_DAYS.slice(0, 6); // exclude Friday by default, per spec's "Friday (Optional)"

  // Load existing entries once to check availability without a query per attempt.
  const existing = await ClassRoutine.find({
    academicYearId,
    isDeleted: false,
    status: { $ne: "ARCHIVED" },
  }).lean();

  const classSlots = new Set(
    existing
      .filter((e) => String(e.classId) === String(classId) && String(e.sectionId) === String(sectionId))
      .map((e) => `${e.day}-${e.period}`)
  );
  const teacherSlots = new Set(existing.map((e) => `${e.teacherId}-${e.day}-${e.period}`));
  const roomSlots = new Set(existing.map((e) => `${e.roomId}-${e.day}-${e.period}`));

  const created = [];
  const skipped = [];

  for (const assignment of assignments) {
    let placed = false;

    outer: for (const day of workingDays) {
      for (const period of periods) {
        const classKey = `${day}-${period.periodNumber}`;
        const teacherKey = `${assignment.teacherId}-${day}-${period.periodNumber}`;
        const roomKey = `${roomId}-${day}-${period.periodNumber}`;

        if (classSlots.has(classKey)) continue;
        if (teacherSlots.has(teacherKey)) continue;
        if (roomSlots.has(roomKey)) continue;

        const entry = await ClassRoutine.create({
          academicYearId,
          classId,
          sectionId,
          groupId: groupId || null,
          day,
          period: period.periodNumber,
          subjectId: assignment.subjectId,
          teacherId: assignment.teacherId,
          roomId,
          startTime: period.startTime,
          endTime: period.endTime,
          status: "DRAFT",
        });

        classSlots.add(classKey);
        teacherSlots.add(teacherKey);
        roomSlots.add(roomKey);
        created.push(entry);
        placed = true;
        break outer;
      }
    }

    if (!placed) {
      skipped.push({
        subjectId: assignment.subjectId,
        teacherId: assignment.teacherId,
        reason: "No free slot available across configured days/periods.",
      });
    }
  }

  return { created, skipped };
};

/** Publish — validates no conflicts exist, then moves DRAFT entries to ACTIVE. */
export const publishRoutine = async ({ academicYearId, classId, sectionId, groupId }) => {
  const conflicts = await detectConflicts({ academicYearId, classId, sectionId, groupId });
  if (conflicts.length > 0) {
    throw ApiError.badRequest("Cannot publish: unresolved conflicts exist.", conflicts);
  }

  const filter = { academicYearId, classId, sectionId, status: "DRAFT", isDeleted: false };
  if (groupId) filter.groupId = groupId;

  const result = await ClassRoutine.updateMany(filter, { status: "ACTIVE" });
  return { published: result.modifiedCount };
};

export const lockRoutine = async ({ academicYearId, classId, sectionId, groupId }) => {
  const filter = { academicYearId, classId, sectionId, status: "ACTIVE", isDeleted: false };
  if (groupId) filter.groupId = groupId;

  const result = await ClassRoutine.updateMany(filter, { status: "LOCKED" });
  return { locked: result.modifiedCount };
};

export const unlockRoutine = async ({ academicYearId, classId, sectionId, groupId }) => {
  const filter = { academicYearId, classId, sectionId, status: "LOCKED", isDeleted: false };
  if (groupId) filter.groupId = groupId;

  const result = await ClassRoutine.updateMany(filter, { status: "ACTIVE" });
  return { unlocked: result.modifiedCount };
};

export const checkConflicts = (scope) => detectConflicts(scope);
