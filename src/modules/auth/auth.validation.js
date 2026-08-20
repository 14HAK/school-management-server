import { z } from "zod";

// Min 8 chars, upper, lower, number, special char — per 04-authentication.md
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[0-9]/, "Password must contain a number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character.");

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Enter a valid email address."),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(1, "Password is required."),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6, "OTP must be 6 digits."),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    purpose: z.enum(["EMAIL_VERIFICATION", "PASSWORD_RESET"]),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6, "OTP must be 6 digits."),
    newPassword: passwordSchema,
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordSchema,
  }),
});
