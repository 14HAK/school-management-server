import { Router } from "express";
import * as paymentController from "./payment.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createPaymentSchema, getPaymentSchema } from "./payment.validation.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize("finance:create"), validate(createPaymentSchema), paymentController.createPayment);
router.get("/", authorize("finance:list"), paymentController.listPayments);
router.get("/:id", authorize("finance:read"), validate(getPaymentSchema), paymentController.getPayment);

export default router;
