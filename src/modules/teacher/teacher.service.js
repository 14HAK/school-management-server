import Teacher from "./teacher.model.js";
import ApiError from "../../shared/ApiError.js";
import { generateEmployeeId } from "../../utils/idGenerator.util.js";
import {
  createUserAccount,
  linkProfile,
  triggerVerificationEmail,
  withTransaction,
} from "../user/user.service.js";

export const createTeacher = async (payload) => {
  const { email, password, personalInfo, contactInfo, academicInfo, experience, bankInformation, joiningDate } =
    payload;

  const { user, teacher } = await withTransaction(async (session) => {
    const user = await createUserAccount({ email, password, roleName: "TEACHER" }, session);

    const employeeId = await generateEmployeeId("T");
    const [teacher] = await Teacher.create(
      [
        {
          userId: user._id,
          employeeId,
          personalInfo,
          contactInfo,
          academicInfo,
          experience,
          bankInformation,
          joiningDate: joiningDate || new Date(),
        },
      ],
      { session }
    );

    await linkProfile(user, "TEACHER", teacher._id, session);

    return { user, teacher };
  });

  await triggerVerificationEmail(user);
  return teacher;
};

export const listTeachers = async ({ page, limit, status, search, sort }) => {
  const filter = { isDeleted: false };
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const [data, total] = await Promise.all([
    Teacher.find(filter)
      .populate("userId", "email accountStatus emailVerified")
      .sort(sort || "-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    Teacher.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getTeacherById = async (id) => {
  const teacher = await Teacher.findOne({ _id: id, isDeleted: false }).populate(
    "userId",
    "email accountStatus emailVerified lastLogin"
  );
  if (!teacher) throw ApiError.notFound("Teacher not found.");
  return teacher;
};

export const updateTeacher = async (id, updates) => {
  const teacher = await Teacher.findOne({ _id: id, isDeleted: false });
  if (!teacher) throw ApiError.notFound("Teacher not found.");

  if (updates.personalInfo) {
    teacher.personalInfo = { ...teacher.personalInfo.toObject(), ...updates.personalInfo };
  }
  if (updates.contactInfo) {
    teacher.contactInfo = { ...teacher.contactInfo.toObject(), ...updates.contactInfo };
  }
  if (updates.academicInfo) teacher.academicInfo = updates.academicInfo;
  if (updates.experience !== undefined) teacher.experience = updates.experience;
  if (updates.bankInformation) teacher.bankInformation = updates.bankInformation;
  if (updates.status) teacher.status = updates.status;

  await teacher.save();
  return teacher;
};

export const deleteTeacher = async (id) => {
  const teacher = await Teacher.findOne({ _id: id, isDeleted: false });
  if (!teacher) throw ApiError.notFound("Teacher not found.");

  teacher.isDeleted = true;
  teacher.status = "INACTIVE";
  await teacher.save();
};
