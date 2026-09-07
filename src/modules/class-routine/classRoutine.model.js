import mongoose from "mongoose";

const WORKING_DAYS = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

const classRoutineSchema = new mongoose.Schema(
  {
    academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
      // required only for Class 9/10/SSC — enforced in service layer
    },
    day: {
      type: String,
      required: true,
      enum: WORKING_DAYS,
    },
    period: {
      type: Number,
      required: true,
      // references Period.periodNumber
    },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Academy", required: true },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "startTime must be in HH:mm format."],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "endTime must be in HH:mm format."],
    },
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "LOCKED", "ARCHIVED"],
      default: "DRAFT",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Duplicate Class Period — one class+section+group can't have two subjects in the same slot.
classRoutineSchema.index(
  { academicYearId: 1, classId: 1, sectionId: 1, groupId: 1, day: 1, period: 1 },
  { unique: true }
);
// Teacher Conflict — a teacher can't be in two places in the same slot.
classRoutineSchema.index({ academicYearId: 1, teacherId: 1, day: 1, period: 1 }, { unique: true });
// Room Conflict — a room can't host two classes in the same slot.
classRoutineSchema.index({ academicYearId: 1, roomId: 1, day: 1, period: 1 }, { unique: true });

export const ROUTINE_WORKING_DAYS = WORKING_DAYS;

const ClassRoutine = mongoose.model("ClassRoutine", classRoutineSchema);

export default ClassRoutine;
