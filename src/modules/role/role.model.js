import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      // e.g. SUPER_ADMIN, ADMIN, PRINCIPAL, VICE_PRINCIPAL, ACCOUNTANT,
      // TEACHER, STAFF, LIBRARIAN, STUDENT, GUARDIAN, RECEPTIONIST, SPORT_OFFICER
    },
    label: {
      type: String,
      required: true,
      trim: true,
      // Human-readable, e.g. "Super Admin"
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    isSystemRole: {
      type: Boolean,
      default: false,
      // system roles (from the default 10) cannot be deleted
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
