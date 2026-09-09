import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as resultService from "./examResult.service.js";

export const generateResults = asyncHandler(async (req, res) => {
  const result = await resultService.generateResults(req.body);
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        result,
        `Generated results for ${result.generated} students${
          result.skipped.length > 0 ? `, ${result.skipped.length} skipped` : ""
        }.`
      )
    );
});

export const publishResults = asyncHandler(async (req, res) => {
  const result = await resultService.publishResults(req.body);
  res.status(200).json(new ApiResponse(200, result, `Published ${result.published} results.`));
});

export const getResultsByStudent = asyncHandler(async (req, res) => {
  const results = await resultService.getResultsByStudent(req.params.studentId);
  res.status(200).json(new ApiResponse(200, results, "Results fetched for student."));
});
