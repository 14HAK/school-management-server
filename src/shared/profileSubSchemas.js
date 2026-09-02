import mongoose from "mongoose";

/** Reused by Student, Teacher, Staff — per 06-user-management.md §Personal Information */
export const personalInfoSchema = new mongoose.Schema(
  {
    nickname: { type: String, trim: true },
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
    dateOfBirth: { type: Date, required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
      default: null,
    },
    nationalId: { type: String, trim: true, default: null },
    photo: { type: String, default: null },
  },
  { _id: false }
);

/** Reused by Student, Teacher, Staff — per 06-user-management.md §Contact Information */
export const contactInfoSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: null },
    division: { type: String, trim: true, default: null },
    district: { type: String, trim: true, default: null },
    upazila: { type: String, trim: true, default: null },
    postalCode: { type: String, trim: true, default: null },
    presentAddress: { type: String, trim: true, default: null },
    permanentAddress: { type: String, trim: true, default: null },
  },
  { _id: false }
);

/** Teacher-only — per 06-user-management.md §Academic Information (Teacher) */
export const teacherAcademicInfoSchema = new mongoose.Schema(
  {
    highestQualification: { type: String, trim: true },
    institution: { type: String, trim: true },
    passingYear: { type: Number },
    result: { type: String, trim: true },
    registrationNumber: { type: String, trim: true },
  },
  { _id: false }
);
