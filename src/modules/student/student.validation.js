import { z } from "zod";
import { isValidObjectId } from "mongoose";

const objectId = z.string().refine(isValidObjectId, "Invalid ID.");

const personalInfoSchema = z.object({
  nickname: z.string().trim().optional(),
  fullName: z.string().trim().min(1, "Full name is required."),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dateOfBirth: z.coerce.date(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  nationalId: z.string().trim().optional(),
  photo: z.string().optional(),
});

const contactInfoSchema = z.object({
  phone: z.string().trim().min(6, "Enter a valid phone number."),
  email: z.string().email().optional(),
  division: z.string().trim().optional(),
  district: z.string().trim().optional(),
  upazila: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  presentAddress: z.string().trim().optional(),
  permanentAddress: z.string().trim().optional(),
});

export const createStudentSchema = z.object({
  body: z.object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    personalInfo: personalInfoSchema,
    contactInfo: contactInfoSchema,
    guardianInfo: z
      .object({
        guardianId: objectId.optional(),
        relation: z.enum(["FATHER", "MOTHER", "LEGAL_GUARDIAN", "OTHER"]).optional(),
      })
      .optional(),
    joiningDate: z.coerce.date().optional(),
  }),
});

export const updateStudentSchema = z.object({
  body: z.object({
    personalInfo: personalInfoSchema.partial().optional(),
    contactInfo: contactInfoSchema.partial().optional(),
    guardianInfo: z
      .object({
        guardianId: objectId.optional(),
        relation: z.enum(["FATHER", "MOTHER", "LEGAL_GUARDIAN", "OTHER"]).optional(),
      })
      .optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED", "SUSPENDED"]).optional(),
  }),
  params: z.object({ id: objectId }),
});

export const getStudentSchema = z.object({
  params: z.object({ id: objectId }),
});
