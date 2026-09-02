import mongoose from "mongoose";
import { personalInfoSchema, contactInfoSchema } from "../../shared/profileSubSchemas.js";

const staffSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // e.g. EMP-S-2026-0007
    },
    designation: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Accountant", "Librarian", "Receptionist", "Security Guard"
    },
    personalInfo: { type: personalInfoSchema, required: true },
    contactInfo: { type: contactInfoSchema, required: true },
    experience: {
      type: Number,
      default: 0,
    },
    joiningDate: { type: Date, required: true, default: Date.now },
    academy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campus",
      default: null,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"],
      default: "ACTIVE",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

staffSchema.index({ "personalInfo.fullName": "text" });

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
