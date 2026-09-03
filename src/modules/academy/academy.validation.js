import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

const BUILDING_NAMES = ["ACA-RED", "ACA-GREEN"];
const FLOORS = ["GROUND_FLOOR", "FIRST_FLOOR", "SECOND_FLOOR", "THIRD_FLOOR"];
const ROOM_TYPES = [
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
];
const ROOM_STATUSES = ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE", "CLOSED"];
const FACILITIES = [
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
];

export const createAcademySchema = z.object({
  body: z.object({
    buildingName: z.enum(BUILDING_NAMES),
    roomNumber: z
      .string()
      .regex(/^RM\d{2}$/, "Room number must be in the format RM01–RM70."),
    floor: z.enum(FLOORS),
    roomType: z.enum(ROOM_TYPES),
    status: z.enum(ROOM_STATUSES).optional(),
    capacity: z.number().min(1, "Capacity must be greater than zero."),
    description: z.string().trim().optional(),
    facilities: z.array(z.enum(FACILITIES)).optional(),
    relatedUsers: z.array(objectId).optional(),
  }),
});

export const updateAcademySchema = z.object({
  body: z.object({
    buildingName: z.enum(BUILDING_NAMES).optional(),
    roomNumber: z
      .string()
      .regex(/^RM\d{2}$/, "Room number must be in the format RM01–RM70.")
      .optional(),
    floor: z.enum(FLOORS).optional(),
    roomType: z.enum(ROOM_TYPES).optional(),
    status: z.enum(ROOM_STATUSES).optional(),
    capacity: z.number().min(1, "Capacity must be greater than zero.").optional(),
    description: z.string().trim().optional(),
    facilities: z.array(z.enum(FACILITIES)).optional(),
    relatedUsers: z.array(objectId).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getAcademySchema = z.object({
  params: z.object({ id: objectId }),
});
