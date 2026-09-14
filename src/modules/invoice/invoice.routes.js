import { Router } from "express";
import * as invoiceController from "./invoice.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/:invoiceNumber", authorize("finance:read"), invoiceController.getInvoiceByNumber);

export default router;
