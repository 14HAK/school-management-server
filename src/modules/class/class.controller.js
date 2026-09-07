import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import Class from "./class.model.js";

/** GET /api/v1/classes — per 08-academic.md, Class is fixed reference data (seeded), no CUD API. */
export const listClasses = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const classes = await Class.find(filter).sort("level");
  res.status(200).json(new ApiResponse(200, classes, "Classes fetched."));
});
