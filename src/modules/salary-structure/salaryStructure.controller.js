import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as salaryStructureService from "./salaryStructure.service.js";

export const createSalaryStructure = asyncHandler(async (req, res) => {
  const structure = await salaryStructureService.createSalaryStructure(req.body);
  res.status(201).json(new ApiResponse(201, structure, "Salary structure created."));
});

export const listSalaryStructures = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await salaryStructureService.listSalaryStructures({
    page,
    limit,
    employeeId: req.query.employeeId,
    status: req.query.status,
  });
  res.status(200).json(new ApiResponse(200, result, "Salary structures fetched."));
});

export const updateSalaryStructure = asyncHandler(async (req, res) => {
  const structure = await salaryStructureService.updateSalaryStructure(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, structure, "Salary structure updated."));
});
