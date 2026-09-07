import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      // "A", "B", "C"
    },
    capacity: {
      type: Number,
      default: 40,
      min: [1, "Capacity must be greater than zero."],
      // per 08-academic.md §Class Capacity — checked before enrollment
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// Section name cannot be duplicated within the same class.
sectionSchema.index({ classId: 1, name: 1 }, { unique: true });

const Section = mongoose.model("Section", sectionSchema);

export default Section;
