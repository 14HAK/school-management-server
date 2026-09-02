import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as staffService from "./staff.service.js";

export const createStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.createStaff(req.body);
  res.status(201).json(new ApiResponse(201, staff, "Staff created successfully."));
});

export const listStaff = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await staffService.listStaff({
    page,
    limit,
    status: req.query.status,
    search: req.query.search,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Staff fetched."));
});

export const getStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.getStaffById(req.params.id);
  res.status(200).json(new ApiResponse(200, staff, "Staff fetched."));
});

export const updateStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.updateStaff(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, staff, "Staff updated."));
});

export const deleteStaff = asyncHandler(async (req, res) => {
  await staffService.deleteStaff(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Staff deleted."));
});
