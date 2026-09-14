import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import ApiError from "../../shared/ApiError.js";
import Receipt from "./receipt.model.js";

/** GET /api/v1/receipts/:receiptNumber — per spec, receipts are looked up by their unique number, not a Mongo _id. */
export const getReceiptByNumber = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findOne({ receiptNumber: req.params.receiptNumber });
  if (!receipt) throw ApiError.notFound("Receipt not found.");
  res.status(200).json(new ApiResponse(200, receipt, "Receipt fetched."));
});
