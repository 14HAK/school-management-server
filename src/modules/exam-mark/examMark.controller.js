import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as markService from "./examMark.service.js";

export const createMark = asyncHandler(async (req, res) => {
  const mark = await markService.createMark(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, mark, "Marks entered."));
});

export const bulkCreateMarks = asyncHandler(async (req, res) => {
  const result = await markService.bulkCreateMarks(req.body, req.user._id);
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        result,
        `Entered marks for ${result.created.length} students${
          result.failed.length > 0 ? `, ${result.failed.length} failed` : ""
        }.`
      )
    );
});

export const listMarks = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(200, Number(req.query.limit) || 50);
  const result = await markService.listMarks({
    page,
    limit,
    examScheduleId: req.query.examScheduleId,
    studentId: req.query.studentId,
  });
  res.status(200).json(new ApiResponse(200, result, "Marks fetched."));
});

export const updateMark = asyncHandler(async (req, res) => {
  const mark = await markService.updateMark(req.params.id, req.body, req.user._id);
  res.status(200).json(new ApiResponse(200, mark, "Marks updated."));
});
