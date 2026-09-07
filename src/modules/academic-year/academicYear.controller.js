import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as academicYearService from "./academicYear.service.js";

export const createAcademicYear = asyncHandler(async (req, res) => {
  const year = await academicYearService.createAcademicYear(req.body);
  res.status(201).json(new ApiResponse(201, year, "Academic year created successfully."));
});

export const listAcademicYears = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await academicYearService.listAcademicYears({
    page,
    limit,
    status: req.query.status,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Academic years fetched."));
});

export const getAcademicYear = asyncHandler(async (req, res) => {
  const year = await academicYearService.getAcademicYearById(req.params.id);
  res.status(200).json(new ApiResponse(200, year, "Academic year fetched."));
});

export const updateAcademicYear = asyncHandler(async (req, res) => {
  const year = await academicYearService.updateAcademicYear(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, year, "Academic year updated."));
});

export const deleteAcademicYear = asyncHandler(async (req, res) => {
  await academicYearService.deleteAcademicYear(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Academic year deleted."));
});
