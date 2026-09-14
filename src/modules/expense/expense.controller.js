import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as expenseService from "./expense.service.js";

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, expense, "Expense recorded."));
});

export const listExpenses = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await expenseService.listExpenses({
    page,
    limit,
    category: req.query.category,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  });
  res.status(200).json(new ApiResponse(200, result, "Expenses fetched."));
});
