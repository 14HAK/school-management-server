import mongoose from "mongoose";

/**
 * "academies" collection — per 07-campus-building-room.md, each document
 * represents ONE PHYSICAL ROOM, not a campus/building. There is currently
 * a single campus (future scope: multiple campuses), so campus itself is
 * not modeled as a separate collection yet — buildingName + floor + room
 * number together identify a room's physical location.
 */
const academySchema = new mongoose.Schema(
  {
    buildingName: {
      type: String,
      required: true,
      enum: ["ACA-RED", "ACA-GREEN"],
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      // Format: RM01–RM70, per spec
      match: [/^RM\d{2}$/, "Room number must be in the format RM01–RM70."],
    },
    floor: {
      type: String,
      required: true,
      enum: ["GROUND_FLOOR", "FIRST_FLOOR", "SECOND_FLOOR", "THIRD_FLOOR"],
    },
    roomType: {
      type: String,
      required: true,
      enum: [
        "CLASSROOM",
        "LAB",
        "COMPUTER_LAB",
        "LIBRARY",
        "PRINCIPAL_OFFICE",
        "STAFF_ROOM",
        "FINANCE_ROOM",
        "AUDITORIUM",
        "CAFETERIA",
        "MOSQUE",
        "STORE_ROOM",
        "WASHROOM",
        "BATHROOM",
        "GATE",
        "MEDICAL_ROOM",
        "EXAM_ROOM",
      ],
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE", "CLOSED"],
      default: "AVAILABLE",
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be greater than zero."],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    facilities: [
      {
        type: String,
        enum: [
          "Whiteboard",
          "Projector",
          "Smart TV",
          "WiFi",
          "Air Conditioner",
          "Computer",
          "Printer",
          "Sound System",
          "CCTV",
          "Generator Backup",
        ],
      },
    ],
    relatedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // e.g. class teacher assigned to a classroom, staff assigned to a room
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Room numbers must be unique inside a building, per spec's Room Number Format rule.
academySchema.index({ buildingName: 1, roomNumber: 1 }, { unique: true });
academySchema.index({ roomType: 1 });
academySchema.index({ status: 1 });

const Academy = mongoose.model("Academy", academySchema);

export default Academy;
