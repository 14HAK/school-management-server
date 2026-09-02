import mongoose from "mongoose";
import { personalInfoSchema, contactInfoSchema } from "../../shared/profileSubSchemas.js";

const guardianInfoSchema = new mongoose.Schema(
  {
    guardianId: { type: mongoose.Schema.Types.ObjectId, ref: "Guardian", default: null },
    relation: {
      type: String,
      enum: ["FATHER", "MOTHER", "LEGAL_GUARDIAN", "OTHER"],
      default: "FATHER",
    },
  },
  { _id: false }
);

/**
 * Academic history only — current class/section/group live in
 * StudentEnrollment (Academic module, Phase 5), never duplicated here.
 * Per 06-user-management.md: "Current class information is NOT stored here."
 */
const academicHistorySchema = new mongoose.Schema(
  {
    previousSchool: { type: String, trim: true, default: null },
    previousClass: { type: String, trim: true, default: null },
    transferCertificateNumber: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Human-readable ID, e.g. STU-2026-00042 — generated at creation time
    },
    personalInfo: { type: personalInfoSchema, required: true },
    contactInfo: { type: contactInfoSchema, required: true },
    guardianInfo: { type: guardianInfoSchema, default: () => ({}) },
    academicInfo: { type: academicHistorySchema, default: () => ({}) },
    joiningDate: { type: Date, required: true, default: Date.now },
    academy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campus",
      default: null,
      // wired to real Campus documents once the Campus module (Phase 3) exists
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED", "SUSPENDED"],
      default: "ACTIVE",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

studentSchema.index({ "personalInfo.fullName": "text" });

const Student = mongoose.model("Student", studentSchema);

export default Student;
