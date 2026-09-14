import mongoose from "mongoose";
import Payment from "./payment.model.js";
import Transaction from "../transaction/transaction.model.js";
import Receipt from "../receipt/receipt.model.js";
import StudentFee from "../student-fee/studentFee.model.js";
import Invoice from "../invoice/invoice.model.js";
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
 * Every successful payment atomically creates a Payment record, a
 * Transaction record, and a Receipt — per spec's Business Rules, this is
 * not optional/best-effort; if any part fails the whole thing rolls back.
 * Payment Amount cannot exceed the fee's Due Amount, per spec's validation
 * rules.
 */
export const createPayment = async ({ studentFeeId, paymentMethod, transactionId, amount, paymentDate, remarks }, receivedBy) => {
  const fee = await StudentFee.findById(studentFeeId);
  if (!fee) throw ApiError.notFound("Student fee not found.");
  if (fee.status === "CANCELLED") throw ApiError.badRequest("Cannot pay a cancelled fee.");
  if (amount > fee.dueAmount) {
    throw ApiError.badRequest(`Payment amount cannot exceed the due amount (${fee.dueAmount}).`);
  }

  return withTransaction(async (session) => {
    const [payment] = await Payment.create(
      [
        {
          studentFeeId,
          paymentMethod,
          transactionId,
          amount,
          paymentDate: paymentDate || new Date(),
          receivedBy,
          remarks,
        },
      ],
      { session }
    );

    await Transaction.create(
      [
        {
          referenceType: "STUDENT_FEE_PAYMENT",
          referenceId: payment._id,
          transactionType: "INCOME",
          amount,
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
          referenceType: "STUDENT_FEE_PAYMENT",
          referenceId: payment._id,
          amount,
          issuedTo: fee.studentId,
          issuedDate: payment.paymentDate,
        },
      ],
      { session }
    );

    fee.paidAmount += amount;
    fee.dueAmount = Math.max(0, fee.amount - fee.discount + fee.fine - fee.paidAmount);
    fee.status = fee.dueAmount <= 0 ? "PAID" : "PARTIAL";
    await fee.save({ session });

    if (fee.status === "PAID") {
      await Invoice.updateMany(
        { studentFeeId: fee._id, status: { $in: ["DRAFT", "SENT"] } },
        { status: "PAID" },
        { session }
      );
    }

    return { ...payment.toObject(), receipt, updatedFee: fee };
  });
};

const populateAll = (query) =>
  query.populate({
    path: "studentFeeId",
    populate: [
      { path: "studentId", select: "studentId personalInfo.fullName" },
      { path: "feeStructureId", select: "name" },
    ],
  });

export const listPayments = async ({ page, limit, studentFeeId, paymentMethod, sort }) => {
  const filter = {};
  if (studentFeeId) filter.studentFeeId = studentFeeId;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  const [data, total] = await Promise.all([
    populateAll(Payment.find(filter))
      .sort(sort || "-paymentDate")
      .skip((page - 1) * limit)
      .limit(limit),
    Payment.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getPaymentById = async (id) => {
  const payment = await populateAll(Payment.findById(id));
  if (!payment) throw ApiError.notFound("Payment not found.");
  return payment;
};
