import { z } from "zod";
import { EXPENSE_CATEGORY_VALUES } from "./expense.model.js";

export const createExpenseSchema = z.object({
  body: z.object({
    category: z.enum(EXPENSE_CATEGORY_VALUES),
    amount: z.number().min(0.01, "Expense amount must be greater than zero."),
    expenseDate: z.coerce.date().optional(),
    description: z.string().trim().optional(),
  }),
});
