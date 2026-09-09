import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createMarkSchema = z.object({
  body: z.object({
    examScheduleId: objectId,
    studentId: objectId,
    obtainedMarks: z.number().min(0, "Marks cannot be negative."),
    remarks: z.string().trim().optional(),
  }),
});

export const bulkCreateMarksSchema = z.object({
  body: z.object({
    examScheduleId: objectId,
    marks: z
      .array(
        z.object({
          studentId: objectId,
          obtainedMarks: z.number().min(0, "Marks cannot be negative."),
          remarks: z.string().trim().optional(),
        })
      )
      .min(1, "At least one student's marks are required."),
  }),
});

export const updateMarkSchema = z.object({
  body: z.object({
    obtainedMarks: z.number().min(0, "Marks cannot be negative."),
    remarks: z.string().trim().optional(),
    reason: z.string().trim().optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getMarkSchema = z.object({
  params: z.object({ id: objectId }),
});
