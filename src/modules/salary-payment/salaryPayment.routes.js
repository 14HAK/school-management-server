import { Router } from "express";
import * as salaryPaymentController from "./salaryPayment.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createSalaryPaymentSchema } from "./salaryPayment.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("finance:create"),
  validate(createSalaryPaymentSchema),
  salaryPaymentController.createSalaryPayment
);
router.get("/", authorize("finance:list"), salaryPaymentController.listSalaryPayments);

export default router;
