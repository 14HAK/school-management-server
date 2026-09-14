import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createFeeStructureSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required."),
    academicYearId: objectId,
    classId: objectId,
    groupId: objectId.optional(),
    amount: z.number().min(0.01, "Amount must be greater than zero."),
    description: z.string().trim().optional(),
  }),
});

export const updateFeeStructureSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    amount: z.number().min(0.01).optional(),
    description: z.string().trim().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getFeeStructureSchema = z.object({
  params: z.object({ id: objectId }),
});
