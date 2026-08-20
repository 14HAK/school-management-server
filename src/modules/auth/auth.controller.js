import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import { setAuthCookies, clearAuthCookies } from "../../utils/cookie.util.js";
import * as authService from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, result, "Registration successful. Please verify your email."));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body);
  res.status(200).json(new ApiResponse(200, result, "Email verified successfully."));
});

export const resendOtp = asyncHandler(async (req, res) => {
  const result = await authService.resendOtp(req.body);
  res.status(200).json(new ApiResponse(200, result, "OTP sent successfully."));
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.loginUser(req.body, req);
  setAuthCookies(res, { accessToken, refreshToken });
  res.status(200).json(new ApiResponse(200, { user }, "Login successful."));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(
    req.cookies?.refreshToken
  );
  setAuthCookies(res, { accessToken, refreshToken: newRefreshToken });
  res.status(200).json(new ApiResponse(200, null, "Token refreshed."));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user?._id, req.cookies?.refreshToken, req);
  clearAuthCookies(res);
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully."));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  res
    .status(200)
    .json(new ApiResponse(200, result, "If the email exists, a reset OTP has been sent."));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  res.status(200).json(new ApiResponse(200, result, "Password reset successful."));
});

export const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, result, "Password changed successfully."));
});

export const getMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, authService.sanitizeUser(req.user), "Current user fetched."));
});
