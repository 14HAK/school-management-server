import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { ROUTINE_WORKING_DAYS } from "./classRoutine.model.js";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");
const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format.");

export const createRoutineSchema = z.object({
  body: z
    .object({
      academicYearId: objectId,
      classId: objectId,
      sectionId: objectId,
      groupId: objectId.optional(),
      day: z.enum(ROUTINE_WORKING_DAYS),
      period: z.number().int().min(1),
      subjectId: objectId,
      teacherId: objectId,
      roomId: objectId,
      startTime: timeString,
      endTime: timeString,
    })
    .refine((data) => data.endTime > data.startTime, {
      message: "End time must be after start time.",
      path: ["endTime"],
    }),
});

export const updateRoutineSchema = z.object({
  body: z.object({
    subjectId: objectId.optional(),
    teacherId: objectId.optional(),
    roomId: objectId.optional(),
    startTime: timeString.optional(),
    endTime: timeString.optional(),
    status: z.enum(["DRAFT", "ACTIVE", "LOCKED", "ARCHIVED"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getRoutineSchema = z.object({
  params: z.object({ id: objectId }),
});

export const generateRoutineSchema = z.object({
  body: z.object({
    academicYearId: objectId,
    classId: objectId,
    sectionId: objectId,
    groupId: objectId.optional(),
    roomId: objectId,
    // Working days to generate across — defaults to all configured days if omitted
    days: z.array(z.enum(ROUTINE_WORKING_DAYS)).optional(),
  }),
});

export const publishRoutineSchema = z.object({
  body: z.object({
    academicYearId: objectId,
    classId: objectId,
    sectionId: objectId,
    groupId: objectId.optional(),
  }),
});

export const lockRoutineSchema = z.object({
  body: z.object({
    academicYearId: objectId,
    classId: objectId,
    sectionId: objectId,
    groupId: objectId.optional(),
  }),
});
