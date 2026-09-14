import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as feeStructureService from "./feeStructure.service.js";

export const createFeeStructure = asyncHandler(async (req, res) => {
  const structure = await feeStructureService.createFeeStructure(req.body);
  res.status(201).json(new ApiResponse(201, structure, "Fee structure created."));
});

export const listFeeStructures = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await feeStructureService.listFeeStructures({
    page,
    limit,
    academicYearId: req.query.academicYearId,
    classId: req.query.classId,
    status: req.query.status,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Fee structures fetched."));
});

export const updateFeeStructure = asyncHandler(async (req, res) => {
  const structure = await feeStructureService.updateFeeStructure(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, structure, "Fee structure updated."));
});

export const deleteFeeStructure = asyncHandler(async (req, res) => {
  await feeStructureService.deleteFeeStructure(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Fee structure deleted."));
});
