import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as salaryPaymentService from "./salaryPayment.service.js";

export const createSalaryPayment = asyncHandler(async (req, res) => {
  const payment = await salaryPaymentService.createSalaryPayment(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, payment, "Salary payment recorded."));
});

export const listSalaryPayments = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await salaryPaymentService.listSalaryPayments({
    page,
    limit,
    employeeId: req.query.employeeId,
    paymentMonth: req.query.paymentMonth,
    status: req.query.status,
  });
  res.status(200).json(new ApiResponse(200, result, "Salary payments fetched."));
});
