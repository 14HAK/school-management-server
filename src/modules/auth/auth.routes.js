import { Router } from "express";
import * as authController from "./auth.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/resend-otp", validate(resendOtpSchema), authController.resendOtp);
router.get("/me", authenticate, authController.getMe);

export default router;
