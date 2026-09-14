import { Router } from "express";
import * as expenseController from "./expense.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createExpenseSchema } from "./expense.validation.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize("finance:create"), validate(createExpenseSchema), expenseController.createExpense);
router.get("/", authorize("finance:list"), expenseController.listExpenses);

export default router;
