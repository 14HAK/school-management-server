import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import Period from "./period.model.js";

export const listPeriods = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const periods = await Period.find(filter).sort("periodNumber");
  res.status(200).json(new ApiResponse(200, periods, "Periods fetched."));
});
