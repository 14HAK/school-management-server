import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import Section from "./section.model.js";

/** GET /api/v1/sections — fixed reference data (seeded per class), optionally filter by classId. */
export const listSections = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.classId) filter.classId = req.query.classId;
  if (req.query.status) filter.status = req.query.status;

  const sections = await Section.find(filter).populate("classId", "name level").sort("name");
  res.status(200).json(new ApiResponse(200, sections, "Sections fetched."));
});
