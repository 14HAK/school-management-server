import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");
const timeString = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format.");

export const createScheduleSchema = z.object({
  body: z
    .object({
      examId: objectId,
      classId: objectId,
      sectionId: objectId,
      groupId: objectId.optional(),
      subjectId: objectId,
      examDate: z.coerce.date(),
      startTime: timeString,
      endTime: timeString,
      roomId: objectId,
      fullMarks: z.number().min(1, "Full marks must be greater than zero."),
      passMarks: z.number().min(0, "Pass marks cannot be negative."),
    })
    .refine((data) => data.endTime > data.startTime, {
      message: "End time must be after start time.",
      path: ["endTime"],
    })
    .refine((data) => data.passMarks <= data.fullMarks, {
      message: "Pass marks cannot exceed full marks.",
      path: ["passMarks"],
    }),
});

export const updateScheduleSchema = z.object({
  body: z.object({
    examDate: z.coerce.date().optional(),
    startTime: timeString.optional(),
    endTime: timeString.optional(),
    roomId: objectId.optional(),
    fullMarks: z.number().min(1).optional(),
    passMarks: z.number().min(0).optional(),
    status: z.enum(["DRAFT", "SCHEDULED", "ONGOING", "COMPLETED", "ARCHIVED"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getScheduleSchema = z.object({
  params: z.object({ id: objectId }),
});

export const addInvigilatorSchema = z.object({
  body: z.object({
    teacherId: objectId,
    role: z.enum(["MAIN", "ASSISTANT"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const removeInvigilatorSchema = z.object({
  params: z.object({ id: objectId, invigilatorId: objectId }),
});
