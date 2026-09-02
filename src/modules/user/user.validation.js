import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const updateUserSchema = z.object({
  body: z.object({
    accountStatus: z
      .enum(["ACTIVE", "INACTIVE", "SUSPENDED", "BLOCKED", "PENDING_VERIFICATION"])
      .optional(),
    roleIds: z.array(objectId).min(1).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getUserSchema = z.object({
  params: z.object({ id: objectId }),
});
