import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import ApiError from "../../shared/ApiError.js";
import User from "./user.model.js";
import { sanitizeUser } from "../auth/auth.service.js";

/** GET /api/v1/users — paginated, filterable list */
export const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const filter = { isDeleted: false };

  if (req.query.status) filter.accountStatus = req.query.status;
  if (req.query.profileType) filter.profileType = req.query.profileType;
  if (req.query.search) {
    filter.email = { $regex: req.query.search, $options: "i" };
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .populate("roleIds", "name label")
      .sort(req.query.sort || "-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        data: users.map(sanitizeUser),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
      "Users fetched."
    )
  );
});

/** GET /api/v1/users/:id */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate({
    path: "roleIds",
    populate: { path: "permissions" },
  });
  if (!user) throw ApiError.notFound("User not found.");
  res.status(200).json(new ApiResponse(200, sanitizeUser(user), "User fetched."));
});

/** PATCH /api/v1/users/:id — admin update (status, roles) */
export const updateUser = asyncHandler(async (req, res) => {
  const { accountStatus, roleIds } = req.body;
  const user = await User.findOne({ _id: req.params.id, isDeleted: false });
  if (!user) throw ApiError.notFound("User not found.");

  if (accountStatus) user.accountStatus = accountStatus;
  if (roleIds) user.roleIds = roleIds;
  await user.save();

  res.status(200).json(new ApiResponse(200, sanitizeUser(user), "User updated."));
});

/** DELETE /api/v1/users/:id — soft delete */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false });
  if (!user) throw ApiError.notFound("User not found.");

  user.isDeleted = true;
  user.deletedAt = new Date();
  user.accountStatus = "INACTIVE";
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "User deleted."));
});

/** GET /api/v1/users/profile — self */
export const getMyProfile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, sanitizeUser(req.user), "Profile fetched."));
});

/** PATCH /api/v1/users/profile — self, email/password/role are never editable here */
export const updateMyProfile = asyncHandler(async (req, res) => {
  // Profile-level fields (name, phone, address, photo) live on the Student/
  // Teacher/Staff/Guardian document, not on User — route the update there
  // once those modules' self-update endpoints exist. For now this endpoint
  // only confirms identity; domain profile editing is exposed via
  // /students/:id, /teachers/:id, etc. (permission-checked).
  res
    .status(200)
    .json(new ApiResponse(200, sanitizeUser(req.user), "Use the profile-specific endpoint to edit personal details."));
});
