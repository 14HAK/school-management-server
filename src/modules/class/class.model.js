import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // "Class 0" .. "Class 10", "SSC"
    },
    level: {
      type: Number,
      required: true,
      unique: true,
      // 0-10 for Class 0-10, 11 for SSC — used for sorting/promotion order
    },
    hasGroups: {
      type: Boolean,
      default: false,
      // true only for Class 9, Class 10, SSC per 08-academic.md
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

classSchema.index({ level: 1 }, { unique: true });

const Class = mongoose.model("Class", classSchema);

export default Class;
