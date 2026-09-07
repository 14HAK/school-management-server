import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    subjectNameBn: {
      type: String,
      trim: true,
      default: null,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      // spec calls this field "classLevel" — modeled as a proper reference to
      // Class per 02-database-design.md's reference-over-embedding rule.
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
      // null = common/mandatory subject for the class (or class has no groups).
      // set = subject is specific to that group (Science/Commerce/Humanities),
      // only meaningful for Class 9, Class 10, SSC.
    },
    isOptional: {
      type: Boolean,
      default: false,
    },
    bookUrl: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

subjectSchema.index({ subjectCode: 1 }, { unique: true });
// Subject Name must not be duplicated within the same Class, per spec.
subjectSchema.index({ classId: 1, subjectName: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
