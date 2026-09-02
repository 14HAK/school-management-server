import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as studentService from "./student.service.js";

export const createStudent = asyncHandler(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(201).json(new ApiResponse(201, student, "Student created successfully."));
});

export const listStudents = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await studentService.listStudents({
    page,
    limit,
    status: req.query.status,
    search: req.query.search,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Students fetched."));
});

export const getStudent = asyncHandler(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);
  res.status(200).json(new ApiResponse(200, student, "Student fetched."));
});

export const updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, student, "Student updated."));
});

export const deleteStudent = asyncHandler(async (req, res) => {
  await studentService.deleteStudent(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Student deleted."));
});
