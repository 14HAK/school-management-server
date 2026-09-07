import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

export const createAcademicYearSchema = z.object({
  body: z
    .object({
      year: z.string().trim().min(4, "Enter a valid year, e.g. 2026."),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "End date must be after start date.",
      path: ["endDate"],
    }),
});

export const updateAcademicYearSchema = z.object({
  body: z.object({
    year: z.string().trim().min(4).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getAcademicYearSchema = z.object({
  params: z.object({ id: objectId }),
});
