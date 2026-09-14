import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as studentFeeService from "./studentFee.service.js";

export const createStudentFee = asyncHandler(async (req, res) => {
  const fee = await studentFeeService.createStudentFee(req.body);
  res.status(201).json(new ApiResponse(201, fee, "Student fee created."));
});

export const listStudentFees = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await studentFeeService.listStudentFees({
    page,
    limit,
    studentId: req.query.studentId,
    academicYearId: req.query.academicYearId,
    status: req.query.status,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Student fees fetched."));
});

export const listStudentFeesByStudent = asyncHandler(async (req, res) => {
  const fees = await studentFeeService.listStudentFeesByStudent(req.params.studentId);
  res.status(200).json(new ApiResponse(200, fees, "Student fees fetched."));
});

export const updateStudentFee = asyncHandler(async (req, res) => {
  const fee = await studentFeeService.updateStudentFee(req.params.id, req.body, req.user._id);
  res.status(200).json(new ApiResponse(200, fee, "Student fee updated."));
});
