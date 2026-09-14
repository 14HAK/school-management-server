import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as paymentService from "./payment.service.js";

export const createPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.createPayment(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, payment, "Payment recorded successfully."));
});

export const listPayments = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await paymentService.listPayments({
    page,
    limit,
    studentFeeId: req.query.studentFeeId,
    paymentMethod: req.query.paymentMethod,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Payments fetched."));
});

export const getPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  res.status(200).json(new ApiResponse(200, payment, "Payment fetched."));
});
