import ClassRoutine from "./classRoutine.model.js";
import TeacherAssignment from "../teacher-assignment/teacherAssignment.model.js";
import Academy from "../academy/academy.model.js";

/**
 * Runs all 5 conflict checks required by 12-class-routine-engine.md before a
 * routine scope can be published:
 *   - Teacher Conflict, Room Conflict, Duplicate Class Period — these are
 *     also prevented at write time by unique indexes on ClassRoutine, but
 *     are re-verified here defensively (e.g. in case entries were seeded/
 *     imported through a path that bypassed the model).
 *   - Duplicate Subject Period — same subject taught twice in one day for
 *     the same class/section/group (allowed to repeat across different
 *     periods, just not flagged as a structural conflict by the unique
 *     index above, so it needs its own explicit check).
 *   - Invalid Assignment — the teacher must actually hold a TeacherAssignment
 *     for that exact subject+class+section+academicYear; this is a
 *     cross-collection business rule the schema/indexes can't enforce.
 *
 * Returns an array of conflict objects; an empty array means the scope is
 * safe to publish.
 */
export const detectConflicts = async ({ academicYearId, classId, sectionId, groupId }) => {
  const conflicts = [];

  const scopeFilter = {
    academicYearId,
    classId,
    sectionId,
    isDeleted: false,
    status: { $ne: "ARCHIVED" },
  };
  if (groupId) scopeFilter.groupId = groupId;

  const entries = await ClassRoutine.find(scopeFilter).lean();

  // --- Duplicate Class Period (same day+period appears twice in this scope) ---
  const classSlotMap = new Map();
  for (const entry of entries) {
    const key = `${entry.day}-${entry.period}`;
    if (!classSlotMap.has(key)) classSlotMap.set(key, []);
    classSlotMap.get(key).push(entry);
  }
  for (const [key, group] of classSlotMap.entries()) {
    if (group.length > 1) {
      conflicts.push({
        type: "DUPLICATE_CLASS_PERIOD",
        message: `Multiple subjects scheduled for the same period (${key}).`,
        entries: group.map((e) => e._id),
      });
    }
  }

  // --- Teacher Conflict (teacher double-booked at the same day+period, anywhere) ---
  const teacherIds = [...new Set(entries.map((e) => String(e.teacherId)))];
  if (teacherIds.length > 0) {
    const teacherEntries = await ClassRoutine.find({
      academicYearId,
      teacherId: { $in: teacherIds },
      isDeleted: false,
      status: { $ne: "ARCHIVED" },
    }).lean();

    const teacherSlotMap = new Map();
    for (const entry of teacherEntries) {
      const key = `${entry.teacherId}-${entry.day}-${entry.period}`;
      if (!teacherSlotMap.has(key)) teacherSlotMap.set(key, []);
      teacherSlotMap.get(key).push(entry);
    }
    for (const [key, group] of teacherSlotMap.entries()) {
      if (group.length > 1) {
        conflicts.push({
          type: "TEACHER_CONFLICT",
          message: `Teacher is scheduled in more than one place for the same period.`,
          entries: group.map((e) => e._id),
        });
      }
    }
  }

  // --- Room Conflict (room double-booked at the same day+period, anywhere) ---
  const roomIds = [...new Set(entries.map((e) => String(e.roomId)))];
  if (roomIds.length > 0) {
    const roomEntries = await ClassRoutine.find({
      academicYearId,
      roomId: { $in: roomIds },
      isDeleted: false,
      status: { $ne: "ARCHIVED" },
    }).lean();

    const roomSlotMap = new Map();
    for (const entry of roomEntries) {
      const key = `${entry.roomId}-${entry.day}-${entry.period}`;
      if (!roomSlotMap.has(key)) roomSlotMap.set(key, []);
      roomSlotMap.get(key).push(entry);
    }
    for (const [key, group] of roomSlotMap.entries()) {
      if (group.length > 1) {
        conflicts.push({
          type: "ROOM_CONFLICT",
          message: `Room is booked for more than one class in the same period.`,
          entries: group.map((e) => e._id),
        });
      }
    }
  }

  // --- Duplicate Subject Period (same subject appears twice on the same day) ---
  const subjectDayMap = new Map();
  for (const entry of entries) {
    const key = `${entry.subjectId}-${entry.day}`;
    if (!subjectDayMap.has(key)) subjectDayMap.set(key, []);
    subjectDayMap.get(key).push(entry);
  }
  for (const [key, group] of subjectDayMap.entries()) {
    if (group.length > 1) {
      conflicts.push({
        type: "DUPLICATE_SUBJECT_PERIOD",
        message: `The same subject is scheduled more than once on the same day.`,
        entries: group.map((e) => e._id),
      });
    }
  }

  // --- Invalid Assignment (teacher must be assigned to teach this subject for this class/section) ---
  for (const entry of entries) {
    const validAssignment = await TeacherAssignment.findOne({
      teacherId: entry.teacherId,
      academicYearId,
      classId,
      sectionId,
      subjectId: entry.subjectId,
      isDeleted: false,
      status: "ACTIVE",
    });
    if (!validAssignment) {
      conflicts.push({
        type: "INVALID_ASSIGNMENT",
        message: "Teacher does not hold an active assignment for this subject/class/section.",
        entries: [entry._id],
      });
    }
  }

  // --- Invalid Assignment (room must be a usable classroom, not under maintenance/closed) ---
  const rooms = await Academy.find({ _id: { $in: roomIds } }).lean();
  const roomStatusMap = new Map(rooms.map((r) => [String(r._id), r.status]));
  for (const entry of entries) {
    const roomStatus = roomStatusMap.get(String(entry.roomId));
    if (roomStatus && ["MAINTENANCE", "CLOSED"].includes(roomStatus)) {
      conflicts.push({
        type: "INVALID_ASSIGNMENT",
        message: `Room is ${roomStatus.toLowerCase()} and cannot be used.`,
        entries: [entry._id],
      });
    }
  }

  return conflicts;
};
