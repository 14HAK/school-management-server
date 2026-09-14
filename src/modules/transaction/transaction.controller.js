import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import Transaction from "./transaction.model.js";

/** GET /api/v1/transactions — records are created internally by payment/salary/expense flows, never directly. */
export const listTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const filter = {};
  if (req.query.referenceType) filter.referenceType = req.query.referenceType;
  if (req.query.transactionType) filter.transactionType = req.query.transactionType;
  if (req.query.startDate && req.query.endDate) {
    filter.transactionDate = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
  }

  const [data, total] = await Promise.all([
    Transaction.find(filter)
      .sort("-transactionDate")
      .skip((page - 1) * limit)
      .limit(limit),
    Transaction.countDocuments(filter),
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
        "Transactions fetched."
      )
    );
});
