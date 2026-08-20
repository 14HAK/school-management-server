import User from "../user/user.model.js";
import Role from "../role/role.model.js";
import Session from "../session/session.model.js";
import OtpRequest from "./otp.model.js";
import ActivityLog from "./activityLog.model.js";
import ApiError from "../../shared/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../../utils/token.util.js";
import { generateOtp, hashOtp, getOtpExpiry } from "../../utils/otp.util.js";
import jwtConfig from "../../config/jwt.js";
import logger from "../../config/logger.js";

const msFromExpiry = (expiry) => {
  // supports "7d", "15m" etc. Falls back to 7 days.
  const match = /^(\d+)([smhd])$/.exec(expiry);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const [, value, unit] = match;
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return Number(value) * multipliers[unit];
};

const logActivity = (userId, action, req, metadata = {}) =>
  ActivityLog.create({
    userId,
    action,
    ipAddress: req?.ip,
    userAgent: req?.headers?.["user-agent"],
    metadata,
  }).catch((err) => logger.error(`Failed to write activity log: ${err.message}`));

const sendOtpEmail = async (email, otp, purpose) => {
  // Email transport (nodemailer/SMTP) is wired in a later phase (Communication module).
  // For Phase 1, we log the OTP so the flow is testable end-to-end without SMTP configured.
  logger.info(`[OTP EMAIL - STUB] To: ${email} | Purpose: ${purpose} | OTP: ${otp}`);
};

/** POST /auth/register — self-registration (defaults to STUDENT-less "pending" account) */
export const registerUser = async ({ email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const defaultRole = await Role.findOne({ name: "GUARDIAN" });
  if (!defaultRole) {
    throw ApiError.internal("Default role not configured. Run the role seed script.");
  }

  const user = await User.create({
    email,
    password,
    roleIds: [defaultRole._id],
    accountStatus: "PENDING_VERIFICATION",
  });

  const otp = generateOtp();
  await OtpRequest.create({
    userId: user._id,
    otpHash: hashOtp(otp),
    purpose: "EMAIL_VERIFICATION",
    expiresAt: getOtpExpiry(),
  });

  await sendOtpEmail(email, otp, "EMAIL_VERIFICATION");
  await logActivity(user._id, "REGISTER", null);

  return { userId: user._id, email: user.email };
};

/** POST /auth/verify-email */
export const verifyEmail = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("Account not found.");

  const otpRecord = await OtpRequest.findOne({
    userId: user._id,
    purpose: "EMAIL_VERIFICATION",
    consumed: false,
  })
    .sort({ createdAt: -1 })
    .select("+otpHash");

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw ApiError.badRequest("OTP is invalid or has expired.");
  }

  if (otpRecord.otpHash !== hashOtp(otp)) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw ApiError.badRequest("Incorrect OTP.");
  }

  otpRecord.consumed = true;
  await otpRecord.save();

  user.emailVerified = true;
  user.accountStatus = "ACTIVE";
  await user.save();

  await logActivity(user._id, "EMAIL_VERIFICATION", null);

  return { verified: true };
};

/** POST /auth/resend-otp */
export const resendOtp = async ({ email, purpose }) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("Account not found.");

  const otp = generateOtp();
  await OtpRequest.create({
    userId: user._id,
    otpHash: hashOtp(otp),
    purpose,
    expiresAt: getOtpExpiry(),
  });

  await sendOtpEmail(email, otp, purpose);

  return { sent: true };
};

/** POST /auth/login */
export const loginUser = async ({ email, password }, req) => {
  const user = await User.findOne({ email }).select("+password").populate("roleIds");

  if (!user) {
    await logActivity(null, "LOGIN_FAILED", req, { email });
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await logActivity(user._id, "LOGIN_FAILED", req, { email });
    throw ApiError.unauthorized("Invalid email or password.");
  }

  if (user.accountStatus !== "ACTIVE") {
    throw ApiError.unauthorized(
      user.accountStatus === "PENDING_VERIFICATION"
        ? "Please verify your email before logging in."
        : `Account is ${user.accountStatus.toLowerCase()}.`
    );
  }

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: "pending", // set below once the token is generated
    device: req?.headers?.["sec-ch-ua-platform"] || null,
    browser: req?.headers?.["user-agent"] || null,
    ipAddress: req?.ip,
    userAgent: req?.headers?.["user-agent"],
    expiresAt: new Date(Date.now() + msFromExpiry(jwtConfig.refreshExpiry)),
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user._id, session._id);

  session.refreshTokenHash = hashToken(refreshToken);
  await session.save();

  user.lastLogin = new Date();
  await user.save();

  await logActivity(user._id, "LOGIN", req);

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
};

/** POST /auth/refresh-token */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw ApiError.unauthorized("Refresh token missing.");

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token.");
  }

  const session = await Session.findById(payload.sessionId).select("+refreshTokenHash");
  if (!session || session.isRevoked || session.expiresAt < new Date()) {
    throw ApiError.unauthorized("Session is no longer valid.");
  }

  if (session.refreshTokenHash !== hashToken(refreshToken)) {
    // Token reuse/mismatch — revoke the session defensively
    session.isRevoked = true;
    session.revokedAt = new Date();
    await session.save();
    throw ApiError.unauthorized("Refresh token mismatch. Please log in again.");
  }

  const user = await User.findById(payload.sub).populate("roleIds");
  if (!user || user.isDeleted || user.accountStatus !== "ACTIVE") {
    throw ApiError.unauthorized("Account no longer active.");
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user._id, session._id);

  session.refreshTokenHash = hashToken(newRefreshToken);
  session.expiresAt = new Date(Date.now() + msFromExpiry(jwtConfig.refreshExpiry));
  await session.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/** POST /auth/logout */
export const logoutUser = async (userId, refreshToken, req) => {
  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      await Session.findByIdAndUpdate(payload.sessionId, {
        isRevoked: true,
        revokedAt: new Date(),
      });
    } catch {
      // token already invalid/expired — nothing to revoke, proceed silently
    }
  }

  await logActivity(userId, "LOGOUT", req);
  return { loggedOut: true };
};

/** POST /auth/forgot-password */
export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  // Do not reveal whether the email exists — always respond success-shaped.
  if (!user) return { sent: true };

  const otp = generateOtp();
  await OtpRequest.create({
    userId: user._id,
    otpHash: hashOtp(otp),
    purpose: "PASSWORD_RESET",
    expiresAt: getOtpExpiry(),
  });

  await sendOtpEmail(email, otp, "PASSWORD_RESET");
  await logActivity(user._id, "FORGOT_PASSWORD", null);

  return { sent: true };
};

/** POST /auth/reset-password */
export const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.badRequest("Invalid request.");

  const otpRecord = await OtpRequest.findOne({
    userId: user._id,
    purpose: "PASSWORD_RESET",
    consumed: false,
  })
    .sort({ createdAt: -1 })
    .select("+otpHash");

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw ApiError.badRequest("OTP is invalid or has expired.");
  }

  if (otpRecord.otpHash !== hashOtp(otp)) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw ApiError.badRequest("Incorrect OTP.");
  }

  otpRecord.consumed = true;
  await otpRecord.save();

  user.password = newPassword; // re-hashed by the pre-save hook
  user.tokenVersion += 1; // invalidate all existing access tokens
  await user.save();

  // Revoke all active sessions on password reset
  await Session.updateMany(
    { userId: user._id, isRevoked: false },
    { isRevoked: true, revokedAt: new Date() }
  );

  await logActivity(user._id, "RESET_PASSWORD", null);

  return { reset: true };
};

/** POST /auth/change-password (authenticated) */
export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.badRequest("Current password is incorrect.");

  user.password = newPassword;
  user.tokenVersion += 1;
  await user.save();

  await Session.updateMany(
    { userId: user._id, isRevoked: false },
    { isRevoked: true, revokedAt: new Date() }
  );

  await logActivity(user._id, "PASSWORD_CHANGE", null);

  return { changed: true };
};

/** GET /auth/me */
export const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  roles: (user.roleIds || []).map((role) =>
    typeof role === "object" ? { id: role._id, name: role.name, label: role.label } : role
  ),
  profileType: user.profileType,
  profileId: user.profileId,
  accountStatus: user.accountStatus,
  emailVerified: user.emailVerified,
  lastLogin: user.lastLogin,
});
