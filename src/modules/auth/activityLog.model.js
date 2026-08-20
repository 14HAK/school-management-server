import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "REGISTER",
        "LOGIN",
        "LOGOUT",
        "FORGOT_PASSWORD",
        "RESET_PASSWORD",
        "PASSWORD_CHANGE",
        "EMAIL_VERIFICATION",
        "REFRESH_TOKEN",
        "LOGIN_FAILED",
      ],
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
