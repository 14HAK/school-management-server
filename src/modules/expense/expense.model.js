import mongoose from "mongoose";

/**
 * The spec lists a separate expenseCategories collection but defines no
 * dedicated API for it — the example list (Salary, Electric Bill, Internet
 * Bill, Stationery, Maintenance, Cleaning, Lab Equipment, Fuel, Others)
 * reads as a fixed reference list, so it's modeled as an enum directly on
 * Expense rather than a standalone collection + CRUD, matching the spec's
 * minimal API surface.
 */
const EXPENSE_CATEGORIES = [
  "Salary",
  "Electric Bill",
  "Internet Bill",
  "Stationery",
  "Maintenance",
  "Cleaning",
  "Lab Equipment",
  "Fuel",
  "Others",
];

const expenseSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: EXPENSE_CATEGORIES },
    amount: { type: Number, required: true, min: [0.01, "Expense amount must be greater than zero."] },
    expenseDate: { type: Date, required: true, default: Date.now },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["RECORDED", "REVERSED"],
      default: "RECORDED",
    },
  },
  { timestamps: true }
);

export const EXPENSE_CATEGORY_VALUES = EXPENSE_CATEGORIES;

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
