import mongoose from "mongoose";

const otpRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
      select: false,
    },
    purpose: {
      type: String,
      enum: ["EMAIL_VERIFICATION", "PASSWORD_RESET"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // 10 minutes from creation, per 04-authentication.md
    },
    consumed: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

otpRequestSchema.index({ userId: 1, purpose: 1 });
otpRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpRequest = mongoose.model("OtpRequest", otpRequestSchema);

export default OtpRequest;
