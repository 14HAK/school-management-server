import mongoose from "mongoose";
import {
  personalInfoSchema,
  contactInfoSchema,
  teacherAcademicInfoSchema,
} from "../../shared/profileSubSchemas.js";

const bankInfoSchema = new mongoose.Schema(
  {
    bankName: { type: String, trim: true, default: null },
    accountNumber: { type: String, trim: true, default: null },
    branch: { type: String, trim: true, default: null },
    routingNumber: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const teacherSchema = new mongoose.Schema(
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
      // e.g. EMP-T-2026-0012
    },
    personalInfo: { type: personalInfoSchema, required: true },
    contactInfo: { type: contactInfoSchema, required: true },
    academicInfo: { type: teacherAcademicInfoSchema, default: () => ({}) },
    experience: {
      type: Number,
      default: 0,
      // years of experience
    },
    bankInformation: { type: bankInfoSchema, default: () => ({}) },
    joiningDate: { type: Date, required: true, default: Date.now },
    academy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campus",
      default: null,
    },
    assignedSubjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        // populated once TeacherAssignment (Phase 5) creates real links;
        // kept here as a fast-lookup denormalized list per spec
      },
    ],
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

teacherSchema.index({ "personalInfo.fullName": "text" });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
