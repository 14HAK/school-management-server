import mongoose from "mongoose";
import Expense from "./expense.model.js";
import Transaction from "../transaction/transaction.model.js";

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

export const createExpense = async (payload, paidBy) => {
  return withTransaction(async (session) => {
    const [expense] = await Expense.create([{ ...payload, paidBy }], { session });

    await Transaction.create(
      [
        {
          referenceType: "EXPENSE",
          referenceId: expense._id,
          transactionType: "EXPENSE",
          amount: expense.amount,
          transactionDate: expense.expenseDate,
        },
      ],
      { session }
    );

    return expense;
  });
};

export const listExpenses = async ({ page, limit, category, startDate, endDate }) => {
  const filter = {};
  if (category) filter.category = category;
  if (startDate && endDate) {
    filter.expenseDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const [data, total] = await Promise.all([
    Expense.find(filter)
      .populate("paidBy", "email")
      .sort("-expenseDate")
      .skip((page - 1) * limit)
      .limit(limit),
    Expense.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};
