import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as teacherService from "./teacher.service.js";

export const createTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.createTeacher(req.body);
  res.status(201).json(new ApiResponse(201, teacher, "Teacher created successfully."));
});

export const listTeachers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await teacherService.listTeachers({
    page,
    limit,
    status: req.query.status,
    search: req.query.search,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Teachers fetched."));
});

export const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id);
  res.status(200).json(new ApiResponse(200, teacher, "Teacher fetched."));
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.updateTeacher(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, teacher, "Teacher updated."));
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  await teacherService.deleteTeacher(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Teacher deleted."));
});
