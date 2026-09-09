import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const generateResultsSchema = z.object({
  body: z.object({
    examId: objectId,
    classId: objectId,
    sectionId: objectId,
    groupId: objectId.optional(),
  }),
});

export const publishResultsSchema = z.object({
  body: z.object({
    examId: objectId,
  }),
});

export const getResultsByStudentSchema = z.object({
  params: z.object({ studentId: objectId }),
});
