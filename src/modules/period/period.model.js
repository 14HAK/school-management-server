import mongoose from "mongoose";

/**
 * Defines the daily period structure (per 12-class-routine-engine.md
 * §Period Configuration). One document per period slot, shared across all
 * classes/sections — the routine engine references periods by number.
 */
const periodSchema = new mongoose.Schema(
  {
    periodNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
      // "HH:mm" 24-hour format, e.g. "08:00"
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "startTime must be in HH:mm format."],
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "endTime must be in HH:mm format."],
    },
    isBreak: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      trim: true,
      default: null,
      // e.g. "Break", "Lunch" — mainly relevant when isBreak is true
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

periodSchema.index({ periodNumber: 1 }, { unique: true });

const Period = mongoose.model("Period", periodSchema);

export default Period;
