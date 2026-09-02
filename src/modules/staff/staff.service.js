import Staff from "./staff.model.js";
import ApiError from "../../shared/ApiError.js";
import { generateEmployeeId } from "../../utils/idGenerator.util.js";
import {
  createUserAccount,
  linkProfile,
  triggerVerificationEmail,
  withTransaction,
} from "../user/user.service.js";

export const createStaff = async (payload) => {
  const { email, password, designation, personalInfo, contactInfo, experience, joiningDate } = payload;

  const { user, staff } = await withTransaction(async (session) => {
    const user = await createUserAccount({ email, password, roleName: "STAFF" }, session);

    const employeeId = await generateEmployeeId("S");
    const [staff] = await Staff.create(
      [
        {
          userId: user._id,
          employeeId,
          designation,
          personalInfo,
          contactInfo,
          experience,
          joiningDate: joiningDate || new Date(),
        },
      ],
      { session }
    );

    await linkProfile(user, "STAFF", staff._id, session);

    return { user, staff };
  });

  await triggerVerificationEmail(user);
  return staff;
};

export const listStaff = async ({ page, limit, status, search, sort }) => {
  const filter = { isDeleted: false };
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const [data, total] = await Promise.all([
    Staff.find(filter)
      .populate("userId", "email accountStatus emailVerified")
      .sort(sort || "-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    Staff.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getStaffById = async (id) => {
  const staff = await Staff.findOne({ _id: id, isDeleted: false }).populate(
    "userId",
    "email accountStatus emailVerified lastLogin"
  );
  if (!staff) throw ApiError.notFound("Staff not found.");
  return staff;
};

export const updateStaff = async (id, updates) => {
  const staff = await Staff.findOne({ _id: id, isDeleted: false });
  if (!staff) throw ApiError.notFound("Staff not found.");

  if (updates.designation) staff.designation = updates.designation;
  if (updates.personalInfo) {
    staff.personalInfo = { ...staff.personalInfo.toObject(), ...updates.personalInfo };
  }
  if (updates.contactInfo) {
    staff.contactInfo = { ...staff.contactInfo.toObject(), ...updates.contactInfo };
  }
  if (updates.experience !== undefined) staff.experience = updates.experience;
  if (updates.status) staff.status = updates.status;

  await staff.save();
  return staff;
};

export const deleteStaff = async (id) => {
  const staff = await Staff.findOne({ _id: id, isDeleted: false });
  if (!staff) throw ApiError.notFound("Staff not found.");

  staff.isDeleted = true;
  staff.status = "INACTIVE";
  await staff.save();
};
