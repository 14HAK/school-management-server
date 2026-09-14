import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createSalaryStructureSchema = z.object({
  body: z.object({
    employeeId: objectId,
    basicSalary: z.number().min(0, "Salary cannot be negative."),
    allowance: z.number().min(0).optional(),
    bonus: z.number().min(0).optional(),
    deduction: z.number().min(0).optional(),
    effectiveDate: z.coerce.date().optional(),
  }),
});

export const updateSalaryStructureSchema = z.object({
  body: z.object({
    basicSalary: z.number().min(0).optional(),
    allowance: z.number().min(0).optional(),
    bonus: z.number().min(0).optional(),
    deduction: z.number().min(0).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getSalaryStructureSchema = z.object({
  params: z.object({ id: objectId }),
});
