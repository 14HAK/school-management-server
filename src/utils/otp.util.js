import crypto from "crypto";

/** 6-digit numeric OTP */
export const generateOtp = () =>
  crypto.randomInt(100000, 999999).toString();

export const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

/** OTP expires 10 minutes from now, per 04-authentication.md */
export const getOtpExpiry = () => new Date(Date.now() + 10 * 60 * 1000);
