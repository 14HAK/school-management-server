import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    resource: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: [
        "create",
        "read",
        "update",
        "delete",
        "list",
        "export",
        "import",
        "approve",
        "publish",
        "assign",
        "manage",
      ],
    },
    // Derived, stored for fast lookup: "resource:action"
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

permissionSchema.pre("validate", function setKey(next) {
  if (this.resource && this.action) {
    this.key = `${this.resource}:${this.action}`;
  }
  next();
});

permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
