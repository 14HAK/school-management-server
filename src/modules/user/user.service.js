import mongoose from "mongoose";
import User from "./user.model.js";
import Role from "../role/role.model.js";
import OtpRequest from "../auth/otp.model.js";
import ApiError from "../../shared/ApiError.js";
import { generateOtp, hashOtp, getOtpExpiry } from "../../utils/otp.util.js";
import logger from "../../config/logger.js";

const sendVerificationEmail = async (email, otp) => {
  // Stub — real SMTP wiring lands in the Communication module (Phase 12/13).
  logger.info(`[VERIFICATION EMAIL - STUB] To: ${email} | OTP: ${otp}`);
};

/**
 * Core of the User Creation Flow (06-user-management.md):
 *   Create User → Hash Password → Assign Role → Create Profile →
 *   Update User.profileId → Send Verification Email → Completed
 *
 * This function performs steps 1–2 (create user, password hashed by the
 * User model's pre-save hook) + role assignment, inside the given session.
 * The caller (student/teacher/staff service) creates the profile document
 * in the SAME transaction, then calls `linkProfile` to finish the flow.
 */
export const createUserAccount = async ({ email, password, roleName }, session) => {
  const existing = await User.findOne({ email }).session(session);
  if (existing) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const role = await Role.findOne({ name: roleName }).session(session);
  if (!role) {
    throw ApiError.internal(`Role "${roleName}" not found. Run the role seed script.`);
  }

  const [user] = await User.create(
    [
      {
        email,
        password,
        roleIds: [role._id],
        accountStatus: "PENDING_VERIFICATION",
      },
    ],
    { session }
  );

  return user;
};

/** Step: Update User.profileId + profileType — completes the creation flow. */
export const linkProfile = async (user, profileType, profileId, session) => {
  user.profileType = profileType;
  user.profileId = profileId;
  await user.save({ session });
};

/** Step: Send Verification Email (fire after the transaction commits). */
export const triggerVerificationEmail = async (user) => {
  const otp = generateOtp();
  await OtpRequest.create({
    userId: user._id,
    otpHash: hashOtp(otp),
    purpose: "EMAIL_VERIFICATION",
    expiresAt: getOtpExpiry(),
  });
  await sendVerificationEmail(user.email, otp);
};

/** Runs a callback inside a Mongo transaction, per 02-database-design.md §3.4. */
export const withTransaction = async (callback) => {
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
