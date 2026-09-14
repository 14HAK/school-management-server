import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PAYMENT_METHOD_VALUES } from "./payment.model.js";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createPaymentSchema = z.object({
  body: z.object({
    studentFeeId: objectId,
    paymentMethod: z.enum(PAYMENT_METHOD_VALUES),
    transactionId: z.string().trim().optional(),
    amount: z.number().min(0.01, "Amount must be greater than zero."),
    paymentDate: z.coerce.date().optional(),
    remarks: z.string().trim().optional(),
  }),
});

export const getPaymentSchema = z.object({
  params: z.object({ id: objectId }),
});
