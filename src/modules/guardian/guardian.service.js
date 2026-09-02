import Guardian from "./guardian.model.js";
import ApiError from "../../shared/ApiError.js";
import {
  createUserAccount,
  linkProfile,
  triggerVerificationEmail,
  withTransaction,
} from "../user/user.service.js";

export const createGuardian = async (payload) => {
  const { createPortalAccess, password, email, ...guardianFields } = payload;

  if (!createPortalAccess) {
    // Guardian record only, no login — per 06-user-management.md userId is optional
    return Guardian.create({ ...guardianFields, email });
  }

  if (!email || !password) {
    throw ApiError.badRequest("Email and password are required to create portal access.");
  }

  const { user, guardian } = await withTransaction(async (session) => {
    const user = await createUserAccount({ email, password, roleName: "GUARDIAN" }, session);

    const [guardian] = await Guardian.create(
      [{ ...guardianFields, email, userId: user._id }],
      { session }
    );

    await linkProfile(user, "GUARDIAN", guardian._id, session);

    return { user, guardian };
  });

  await triggerVerificationEmail(user);
  return guardian;
};

export const listGuardians = async ({ page, limit, search, sort }) => {
  const filter = { isDeleted: false };
  if (search) {
    filter.$or = [
      { fatherName: { $regex: search, $options: "i" } },
      { motherName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    Guardian.find(filter)
      .populate("students", "studentId personalInfo.fullName")
      .sort(sort || "-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    Guardian.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getGuardianById = async (id) => {
  const guardian = await Guardian.findOne({ _id: id, isDeleted: false }).populate(
    "students",
    "studentId personalInfo.fullName"
  );
  if (!guardian) throw ApiError.notFound("Guardian not found.");
  return guardian;
};

export const updateGuardian = async (id, updates) => {
  const guardian = await Guardian.findOne({ _id: id, isDeleted: false });
  if (!guardian) throw ApiError.notFound("Guardian not found.");

  Object.assign(guardian, updates);
  await guardian.save();
  return guardian;
};
