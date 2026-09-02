import Student from "./student.model.js";
import ApiError from "../../shared/ApiError.js";
import { generateStudentId } from "../../utils/idGenerator.util.js";
import {
  createUserAccount,
  linkProfile,
  triggerVerificationEmail,
  withTransaction,
} from "../user/user.service.js";

/**
 * Full User Creation Flow (06-user-management.md):
 * Create User → Hash Password → Assign Role (STUDENT) → Create Student Profile
 * → Update User.profileId → Send Verification Email → Completed
 */
export const createStudent = async ({ email, password, personalInfo, contactInfo, guardianInfo, joiningDate }) => {
  const { user, student } = await withTransaction(async (session) => {
    const user = await createUserAccount({ email, password, roleName: "STUDENT" }, session);

    const studentId = await generateStudentId();
    const [student] = await Student.create(
      [
        {
          userId: user._id,
          studentId,
          personalInfo,
          contactInfo,
          guardianInfo,
          joiningDate: joiningDate || new Date(),
        },
      ],
      { session }
    );

    await linkProfile(user, "STUDENT", student._id, session);

    return { user, student };
  });

  // Fire-and-forget outside the transaction — email failure shouldn't roll back creation
  await triggerVerificationEmail(user);

  return student;
};

export const listStudents = async ({ page, limit, status, search, sort }) => {
  const filter = { isDeleted: false };
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const [data, total] = await Promise.all([
    Student.find(filter)
      .populate("userId", "email accountStatus emailVerified")
      .sort(sort || "-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getStudentById = async (id) => {
  const student = await Student.findOne({ _id: id, isDeleted: false }).populate(
    "userId",
    "email accountStatus emailVerified lastLogin"
  );
  if (!student) throw ApiError.notFound("Student not found.");
  return student;
};

export const updateStudent = async (id, updates) => {
  const student = await Student.findOne({ _id: id, isDeleted: false });
  if (!student) throw ApiError.notFound("Student not found.");

  if (updates.personalInfo) {
    student.personalInfo = { ...student.personalInfo.toObject(), ...updates.personalInfo };
  }
  if (updates.contactInfo) {
    student.contactInfo = { ...student.contactInfo.toObject(), ...updates.contactInfo };
  }
  if (updates.guardianInfo) {
    student.guardianInfo = { ...student.guardianInfo.toObject(), ...updates.guardianInfo };
  }
  if (updates.status) student.status = updates.status;

  await student.save();
  return student;
};

/** Soft delete only — per 02-database-design.md, hard delete is Super Admin-only elsewhere. */
export const deleteStudent = async (id) => {
  const student = await Student.findOne({ _id: id, isDeleted: false });
  if (!student) throw ApiError.notFound("Student not found.");

  student.isDeleted = true;
  student.status = "INACTIVE";
  await student.save();
};
