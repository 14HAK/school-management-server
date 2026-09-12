import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as summaryService from "./attendanceSummary.service.js";

export const getStudentDailySummary = asyncHandler(async (req, res) => {
  const summary = await summaryService.getStudentDailySummary(req.params.studentId, req.query);
  res.status(200).json(new ApiResponse(200, summary, "Monthly attendance summary fetched."));
});

export const getStudentYearlySummary = asyncHandler(async (req, res) => {
  const summary = await summaryService.getStudentYearlySummary(req.params.studentId, req.query);
  res.status(200).json(new ApiResponse(200, summary, "Yearly attendance summary fetched."));
});

export const getClassDailySummary = asyncHandler(async (req, res) => {
  const summary = await summaryService.getClassDailySummary(req.query);
  res.status(200).json(new ApiResponse(200, summary, "Class attendance summary fetched."));
});
