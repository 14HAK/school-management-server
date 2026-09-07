import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createSubjectSchema = z.object({
  body: z.object({
    subjectCode: z.string().trim().min(1, "Subject code is required."),
    subjectName: z.string().trim().min(1, "Subject name is required."),
    subjectNameBn: z.string().trim().optional(),
    classId: objectId,
    group: objectId.optional(),
    isOptional: z.boolean().optional(),
    bookUrl: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
    description: z.string().trim().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  }),
});

export const updateSubjectSchema = z.object({
  body: z.object({
    subjectCode: z.string().trim().min(1).optional(),
    subjectName: z.string().trim().min(1).optional(),
    subjectNameBn: z.string().trim().optional(),
    classId: objectId.optional(),
    group: objectId.nullable().optional(),
    isOptional: z.boolean().optional(),
    bookUrl: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
    description: z.string().trim().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getSubjectSchema = z.object({
  params: z.object({ id: objectId }),
});
