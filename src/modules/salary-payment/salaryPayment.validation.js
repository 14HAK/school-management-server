import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PAYMENT_METHOD_VALUES } from "../payment/payment.model.js";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createSalaryPaymentSchema = z.object({
  body: z.object({
    employeeId: objectId,
    salaryStructureId: objectId.optional(),
    paymentMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "paymentMonth must be in YYYY-MM format."),
    paymentDate: z.coerce.date().optional(),
    amount: z.number().min(0.01, "Amount must be greater than zero."),
    paymentMethod: z.enum(PAYMENT_METHOD_VALUES),
  }),
});
