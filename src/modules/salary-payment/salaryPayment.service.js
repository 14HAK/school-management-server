import mongoose from "mongoose";
import SalaryPayment from "./salaryPayment.model.js";
import Transaction from "../transaction/transaction.model.js";
import Receipt from "../receipt/receipt.model.js";
import ApiError from "../../shared/ApiError.js";
import { generateReceiptNumber } from "../../utils/idGenerator.util.js";

const withTransaction = async (callback) => {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await callback(session);
    });
    return result;
  } finally {
    session.endSession();
  }
};

/**
 * Applies the same "every successful payment creates a Payment + Transaction
 * + Receipt" rule the spec states for student fee payments — a salary
 * payment is a payment in the general sense the Business Rules describe,
 * so the same audit trail applies here for consistency.
 */
export const createSalaryPayment = async (payload, receivedBy) => {
  return withTransaction(async (session) => {
    let payment;
    try {
      [payment] = await SalaryPayment.create([payload], { session });
    } catch (err) {
      if (err.code === 11000) {
        throw ApiError.conflict(`Salary for ${payload.paymentMonth} has already been paid to this employee.`);
      }
      throw err;
    }

    await Transaction.create(
      [
        {
          referenceType: "SALARY_PAYMENT",
          referenceId: payment._id,
          transactionType: "EXPENSE",
          amount: payment.amount,
          transactionDate: payment.paymentDate,
        },
      ],
      { session }
    );

    const receiptNumber = await generateReceiptNumber();
    const [receipt] = await Receipt.create(
      [
        {
          receiptNumber,
          referenceType: "SALARY_PAYMENT",
          referenceId: payment._id,
          amount: payment.amount,
          issuedTo: payment.employeeId,
          issuedDate: payment.paymentDate,
        },
      ],
      { session }
    );

    return { ...payment.toObject(), receipt };
  });
};

export const listSalaryPayments = async ({ page, limit, employeeId, paymentMonth, status }) => {
  const filter = {};
  if (employeeId) filter.employeeId = employeeId;
  if (paymentMonth) filter.paymentMonth = paymentMonth;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    SalaryPayment.find(filter)
      .populate("employeeId", "email")
      .sort("-paymentDate")
      .skip((page - 1) * limit)
      .limit(limit),
    SalaryPayment.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};
