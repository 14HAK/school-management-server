import TeacherAssignment from "./teacherAssignment.model.js";
import Class from "../class/class.model.js";
import ApiError from "../../shared/ApiError.js";

export const createAssignment = async (payload) => {
  const klass = await Class.findById(payload.classId);
  if (!klass) throw ApiError.badRequest("Class not found.");

  // Group is required only for Class 9, Class 10, SSC — per 08-academic.md / 10-teacher-assignment.md
  if (klass.hasGroups && !payload.groupId) {
    throw ApiError.badRequest(`Group is required for ${klass.name}.`);
  }
  if (!klass.hasGroups && payload.groupId) {
    throw ApiError.badRequest(`${klass.name} does not use groups.`);
  }

  // Duplicate assignment check (also enforced by the unique index, but this
  // gives a clean 409 instead of a raw Mongo duplicate-key error).
  const duplicate = await TeacherAssignment.findOne({
    teacherId: payload.teacherId,
    academicYearId: payload.academicYearId,
    classId: payload.classId,
    sectionId: payload.sectionId,
    subjectId: payload.subjectId,
    isDeleted: false,
  });
  if (duplicate) {
    throw ApiError.conflict("This teacher is already assigned to this subject for this class and section.");
  }

  // Each section can have only one Class Teacher, per 10-teacher-assignment.md
  if (payload.isClassTeacher) {
    const existingClassTeacher = await TeacherAssignment.findOne({
      academicYearId: payload.academicYearId,
      classId: payload.classId,
      sectionId: payload.sectionId,
      isClassTeacher: true,
      isDeleted: false,
    });
    if (existingClassTeacher) {
      throw ApiError.conflict("This section already has a class teacher assigned.");
    }
  }

  return TeacherAssignment.create(payload);
};

export const listAssignments = async ({
  page,
  limit,
  teacherId,
  academicYearId,
  classId,
  sectionId,
  subjectId,
  status,
  sort,
}) => {
  const filter = { isDeleted: false };
  if (teacherId) filter.teacherId = teacherId;
  if (academicYearId) filter.academicYearId = academicYearId;
  if (classId) filter.classId = classId;
  if (sectionId) filter.sectionId = sectionId;
  if (subjectId) filter.subjectId = subjectId;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    TeacherAssignment.find(filter)
      .populate("teacherId", "employeeId personalInfo.fullName")
      .populate("academicYearId", "year")
      .populate("classId", "name level")
      .populate("sectionId", "name")
      .populate("groupId", "name")
      .populate("subjectId", "subjectName subjectCode")
      .sort(sort || "-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    TeacherAssignment.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

const populateAll = (query) =>
  query
    .populate("teacherId", "employeeId personalInfo.fullName")
    .populate("academicYearId", "year")
    .populate("classId", "name level")
    .populate("sectionId", "name")
    .populate("groupId", "name")
    .populate("subjectId", "subjectName subjectCode");

export const getAssignmentById = async (id) => {
  const assignment = await populateAll(
    TeacherAssignment.findOne({ _id: id, isDeleted: false })
  );
  if (!assignment) throw ApiError.notFound("Assignment not found.");
  return assignment;
};

export const updateAssignment = async (id, updates) => {
  const assignment = await TeacherAssignment.findOne({ _id: id, isDeleted: false });
  if (!assignment) throw ApiError.notFound("Assignment not found.");

  if (updates.isClassTeacher && !assignment.isClassTeacher) {
    const existingClassTeacher = await TeacherAssignment.findOne({
      _id: { $ne: id },
      academicYearId: assignment.academicYearId,
      classId: assignment.classId,
      sectionId: assignment.sectionId,
      isClassTeacher: true,
      isDeleted: false,
    });
    if (existingClassTeacher) {
      throw ApiError.conflict("This section already has a class teacher assigned.");
    }
  }

  Object.assign(assignment, updates);
  await assignment.save();
  return assignment;
};

export const deleteAssignment = async (id) => {
  const assignment = await TeacherAssignment.findOne({ _id: id, isDeleted: false });
  if (!assignment) throw ApiError.notFound("Assignment not found.");

  assignment.isDeleted = true;
  assignment.status = "ARCHIVED";
  await assignment.save();
};

export const listAssignmentsByTeacher = (teacherId) =>
  populateAll(TeacherAssignment.find({ teacherId, isDeleted: false, status: "ACTIVE" }));

export const listAssignmentsByClass = (classId) =>
  populateAll(TeacherAssignment.find({ classId, isDeleted: false, status: "ACTIVE" }));

export const listAssignmentsBySubject = (subjectId) =>
  populateAll(TeacherAssignment.find({ subjectId, isDeleted: false, status: "ACTIVE" }));
