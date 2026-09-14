import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createStudentFeeSchema = z.object({
  body: z.object({
    studentId: objectId,
    academicYearId: objectId,
    feeStructureId: objectId,
    discount: z.number().min(0).optional(),
    fine: z.number().min(0).optional(),
  }),
});

export const updateStudentFeeSchema = z.object({
  body: z.object({
    discount: z.number().min(0).optional(),
    fine: z.number().min(0).optional(),
    status: z.enum(["PENDING", "PARTIAL", "PAID", "OVERDUE", "CANCELLED"]).optional(),
    reason: z.string().trim().optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getStudentFeeSchema = z.object({
  params: z.object({ id: objectId }),
});
