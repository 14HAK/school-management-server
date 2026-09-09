import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as examService from "./exam.service.js";

export const createExam = asyncHandler(async (req, res) => {
  const exam = await examService.createExam(req.body);
  res.status(201).json(new ApiResponse(201, exam, "Exam created successfully."));
});

export const listExams = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await examService.listExams({
    page,
    limit,
    academicYearId: req.query.academicYearId,
    examType: req.query.examType,
    status: req.query.status,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Exams fetched."));
});

export const getExam = asyncHandler(async (req, res) => {
  const exam = await examService.getExamById(req.params.id);
  res.status(200).json(new ApiResponse(200, exam, "Exam fetched."));
});

export const updateExam = asyncHandler(async (req, res) => {
  const exam = await examService.updateExam(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, exam, "Exam updated."));
});

export const deleteExam = asyncHandler(async (req, res) => {
  await examService.deleteExam(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Exam deleted."));
});
