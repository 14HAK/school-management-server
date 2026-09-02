import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createGuardianSchema = z.object({
  body: z.object({
    fatherName: z.string().trim().optional(),
    motherName: z.string().trim().optional(),
    phone: z.string().trim().min(6, "Enter a valid phone number."),
    email: z.string().email().optional(),
    occupation: z.string().trim().optional(),
    address: z.string().trim().optional(),
    students: z.array(objectId).optional(),
    // Optional portal access — if provided, a linked User account is created
    createPortalAccess: z.boolean().optional(),
    password: z.string().min(8).optional(),
  }),
});

export const updateGuardianSchema = z.object({
  body: z.object({
    fatherName: z.string().trim().optional(),
    motherName: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    email: z.string().email().optional(),
    occupation: z.string().trim().optional(),
    address: z.string().trim().optional(),
    students: z.array(objectId).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getGuardianSchema = z.object({
  params: z.object({ id: objectId }),
});
