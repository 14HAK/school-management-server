import { Router } from "express";
import * as receiptController from "./receipt.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/:receiptNumber", authorize("finance:read"), receiptController.getReceiptByNumber);

export default router;
