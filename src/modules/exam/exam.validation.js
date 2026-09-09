import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { EXAM_TYPE_VALUES } from "./exam.model.js";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createExamSchema = z.object({
  body: z
    .object({
      academicYearId: objectId,
      examName: z.string().trim().min(1, "Exam name is required."),
      examType: z.enum(EXAM_TYPE_VALUES),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: "End date must be on or after start date.",
      path: ["endDate"],
    }),
});

export const updateExamSchema = z.object({
  body: z.object({
    examName: z.string().trim().min(1).optional(),
    examType: z.enum(EXAM_TYPE_VALUES).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.enum(["DRAFT", "SCHEDULED", "ONGOING", "COMPLETED", "PUBLISHED", "ARCHIVED"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getExamSchema = z.object({
  params: z.object({ id: objectId }),
});
