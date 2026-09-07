import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createEnrollmentSchema = z.object({
  body: z.object({
    studentId: objectId,
    academicYearId: objectId,
    classId: objectId,
    sectionId: objectId,
    groupId: objectId.optional(),
    rollNumber: z.string().trim().min(1, "Roll number is required."),
    admissionDate: z.coerce.date().optional(),
    remarks: z.string().trim().optional(),
  }),
});

export const updateEnrollmentSchema = z.object({
  body: z.object({
    rollNumber: z.string().trim().min(1).optional(),
    status: z
      .enum(["PENDING", "ACTIVE", "PROMOTED", "TRANSFERRED", "COMPLETED", "DROPPED"])
      .optional(),
    remarks: z.string().trim().optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getEnrollmentSchema = z.object({
  params: z.object({ id: objectId }),
});

export const promoteEnrollmentSchema = z.object({
  body: z.object({
    enrollmentId: objectId,
    toAcademicYearId: objectId,
    toClassId: objectId,
    toSectionId: objectId,
    toGroupId: objectId.optional(),
    rollNumber: z.string().trim().min(1, "Roll number is required."),
  }),
});

export const transferEnrollmentSchema = z.object({
  body: z.object({
    enrollmentId: objectId,
    toClassId: objectId,
    toSectionId: objectId,
    toGroupId: objectId.optional(),
    rollNumber: z.string().trim().min(1, "Roll number is required."),
    remarks: z.string().trim().optional(),
  }),
});
