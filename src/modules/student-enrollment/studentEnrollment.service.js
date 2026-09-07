import mongoose from "mongoose";
import StudentEnrollment from "./studentEnrollment.model.js";
import Class from "../class/class.model.js";
import Section from "../section/section.model.js";
import ApiError from "../../shared/ApiError.js";

const withTransaction = async (callback) => {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await callback(session);
    });
    return result;
  } finally {
    session.endSession();
  }
};

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

const assertSectionCapacity = async (sectionId, academicYearId, session) => {
  const section = await Section.findById(sectionId);
  if (!section) throw ApiError.badRequest("Section not found.");

  const currentCount = await StudentEnrollment.countDocuments({
    sectionId,
    academicYearId,
    status: "ACTIVE",
    isDeleted: false,
  }).session(session || null);

  if (currentCount >= section.capacity) {
    throw ApiError.conflict(
      `Section is at full capacity (${section.capacity}). Cannot enroll more students.`
    );
  }
};

const assertNoDuplicateActiveEnrollment = async (studentId, academicYearId, session) => {
  const existing = await StudentEnrollment.findOne({
    studentId,
    academicYearId,
    status: "ACTIVE",
    isDeleted: false,
  }).session(session || null);
  if (existing) {
    throw ApiError.conflict("This student already has an active enrollment for this academic year.");
  }
};

const assertRollNumberAvailable = async (
  { academicYearId, classId, sectionId, rollNumber },
  session,
  excludeId
) => {
  const filter = { academicYearId, classId, sectionId, rollNumber, isDeleted: false };
  if (excludeId) filter._id = { $ne: excludeId };
  const clash = await StudentEnrollment.findOne(filter).session(session || null);
  if (clash) {
    throw ApiError.conflict(`Roll number ${rollNumber} is already taken in this class/section.`);
  }
};

export const createEnrollment = async (payload) => {
  await assertGroupRule(payload.classId, payload.groupId);
  await assertNoDuplicateActiveEnrollment(payload.studentId, payload.academicYearId);
  await assertRollNumberAvailable(payload);
  await assertSectionCapacity(payload.sectionId, payload.academicYearId);

  return StudentEnrollment.create({ ...payload, status: "ACTIVE" });
};

const populateAll = (query) =>
  query
    .populate("studentId", "studentId personalInfo.fullName")
    .populate("academicYearId", "year")
    .populate("classId", "name level")
    .populate("sectionId", "name")
    .populate("groupId", "name");

export const listEnrollments = async ({
  page,
  limit,
  studentId,
  academicYearId,
  classId,
  sectionId,
  status,
  sort,
}) => {
  const filter = { isDeleted: false };
  if (studentId) filter.studentId = studentId;
  if (academicYearId) filter.academicYearId = academicYearId;
  if (classId) filter.classId = classId;
  if (sectionId) filter.sectionId = sectionId;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    populateAll(StudentEnrollment.find(filter))
      .sort(sort || "rollNumber")
      .skip((page - 1) * limit)
      .limit(limit),
    StudentEnrollment.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getEnrollmentById = async (id) => {
  const enrollment = await populateAll(StudentEnrollment.findOne({ _id: id, isDeleted: false }));
  if (!enrollment) throw ApiError.notFound("Enrollment not found.");
  return enrollment;
};

export const updateEnrollment = async (id, updates) => {
  const enrollment = await StudentEnrollment.findOne({ _id: id, isDeleted: false });
  if (!enrollment) throw ApiError.notFound("Enrollment not found.");

  if (updates.rollNumber && updates.rollNumber !== enrollment.rollNumber) {
    await assertRollNumberAvailable(
      {
        academicYearId: enrollment.academicYearId,
        classId: enrollment.classId,
        sectionId: enrollment.sectionId,
        rollNumber: updates.rollNumber,
      },
      null,
      id
    );
  }

  Object.assign(enrollment, updates);
  await enrollment.save();
  return enrollment;
};

/**
 * Per 11-student-enrollment.md: "A deleted enrollment must never remove
 * academic history." Soft delete only, and only ever used for correcting a
 * genuine data-entry mistake, not for graduating/promoting/transferring
 * students — those flows never delete, they change status.
 */
export const deleteEnrollment = async (id) => {
  const enrollment = await StudentEnrollment.findOne({ _id: id, isDeleted: false });
  if (!enrollment) throw ApiError.notFound("Enrollment not found.");

  enrollment.isDeleted = true;
  await enrollment.save();
};

export const listEnrollmentsByStudent = (studentId) =>
  populateAll(StudentEnrollment.find({ studentId, isDeleted: false })).sort("-createdAt");

/**
 * Promotion — per spec: "Promotion creates a new Enrollment. Previous
 * Enrollment remains unchanged" (its historical class/section/roll data is
 * never rewritten). The previous record's status moves to PROMOTED so it no
 * longer counts as the student's active enrollment.
 */
export const promoteEnrollment = async ({
  enrollmentId,
  toAcademicYearId,
  toClassId,
  toSectionId,
  toGroupId,
  rollNumber,
}) => {
  const source = await StudentEnrollment.findOne({ _id: enrollmentId, isDeleted: false });
  if (!source) throw ApiError.notFound("Source enrollment not found.");

  await assertGroupRule(toClassId, toGroupId);
  await assertNoDuplicateActiveEnrollment(source.studentId, toAcademicYearId);
  await assertRollNumberAvailable({
    academicYearId: toAcademicYearId,
    classId: toClassId,
    sectionId: toSectionId,
    rollNumber,
  });
  await assertSectionCapacity(toSectionId, toAcademicYearId);

  return withTransaction(async (session) => {
    const [newEnrollment] = await StudentEnrollment.create(
      [
        {
          studentId: source.studentId,
          academicYearId: toAcademicYearId,
          classId: toClassId,
          sectionId: toSectionId,
          groupId: toGroupId || null,
          rollNumber,
          status: "ACTIVE",
          admissionDate: new Date(),
        },
      ],
      { session }
    );

    source.status = "PROMOTED";
    await source.save({ session });

    return newEnrollment;
  });
};

/**
 * Transfer — same idea as promotion but typically within the same academic
 * year (e.g. moving to a different section, or a mid-year class change).
 * Per spec: "Transfer keeps previous enrollment history. New enrollment is
 * created for the destination class."
 */
export const transferEnrollment = async ({
  enrollmentId,
  toClassId,
  toSectionId,
  toGroupId,
  rollNumber,
  remarks,
}) => {
  const source = await StudentEnrollment.findOne({ _id: enrollmentId, isDeleted: false });
  if (!source) throw ApiError.notFound("Source enrollment not found.");

  await assertGroupRule(toClassId, toGroupId);
  await assertRollNumberAvailable({
    academicYearId: source.academicYearId,
    classId: toClassId,
    sectionId: toSectionId,
    rollNumber,
  });
  await assertSectionCapacity(toSectionId, source.academicYearId);

  return withTransaction(async (session) => {
    const [newEnrollment] = await StudentEnrollment.create(
      [
        {
          studentId: source.studentId,
          academicYearId: source.academicYearId,
          classId: toClassId,
          sectionId: toSectionId,
          groupId: toGroupId || null,
          rollNumber,
          status: "ACTIVE",
          admissionDate: new Date(),
          remarks: remarks || null,
        },
      ],
      { session }
    );

    source.status = "TRANSFERRED";
    await source.save({ session });

    return newEnrollment;
  });
};
