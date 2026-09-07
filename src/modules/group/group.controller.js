import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import Group from "./group.model.js";

/** GET /api/v1/groups — fixed reference data (Science/Commerce/Humanities), seeded. */
export const listGroups = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const groups = await Group.find(filter).sort("name");
  res.status(200).json(new ApiResponse(200, groups, "Groups fetched."));
});
