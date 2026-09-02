import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      // Optional per 06-user-management.md — a guardian may exist purely as a
      // record without portal login access, then be upgraded to a User later.
    },
    fatherName: { type: String, trim: true, default: null },
    motherName: { type: String, trim: true, default: null },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: null },
    occupation: { type: String, trim: true, default: null },
    address: { type: String, trim: true, default: null },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

guardianSchema.index({ phone: 1 });

const Guardian = mongoose.model("Guardian", guardianSchema);

export default Guardian;
