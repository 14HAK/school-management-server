import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createAssignmentSchema = z.object({
  body: z.object({
    teacherId: objectId,
    academicYearId: objectId,
    classId: objectId,
    sectionId: objectId,
    groupId: objectId.optional(),
    subjectId: objectId,
    isClassTeacher: z.boolean().optional(),
    remarks: z.string().trim().optional(),
  }),
});

export const updateAssignmentSchema = z.object({
  body: z.object({
    isClassTeacher: z.boolean().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
    remarks: z.string().trim().optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getAssignmentSchema = z.object({
  params: z.object({ id: objectId }),
});
