import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import securityConfig from "../../config/security.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // never returned by default
    },
    roleIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
      },
    ],
    profileType: {
      type: String,
      enum: ["STUDENT", "TEACHER", "STAFF", "GUARDIAN", null],
      default: null,
      // null for Super Admin / Admin / Principal-type accounts with no domain profile
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      // resolved dynamically via profileType (Student / Teacher / Staff / Guardian)
    },
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED", "BLOCKED", "PENDING_VERIFICATION"],
      default: "PENDING_VERIFICATION",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      // bumped on password change / forced logout-all to invalidate old access tokens
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, securityConfig.bcryptSaltRounds);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;
