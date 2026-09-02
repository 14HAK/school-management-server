import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as guardianService from "./guardian.service.js";

export const createGuardian = asyncHandler(async (req, res) => {
  const guardian = await guardianService.createGuardian(req.body);
  res.status(201).json(new ApiResponse(201, guardian, "Guardian created successfully."));
});

export const listGuardians = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await guardianService.listGuardians({
    page,
    limit,
    search: req.query.search,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Guardians fetched."));
});

export const getGuardian = asyncHandler(async (req, res) => {
  const guardian = await guardianService.getGuardianById(req.params.id);
  res.status(200).json(new ApiResponse(200, guardian, "Guardian fetched."));
});

export const updateGuardian = asyncHandler(async (req, res) => {
  const guardian = await guardianService.updateGuardian(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, guardian, "Guardian updated."));
});
