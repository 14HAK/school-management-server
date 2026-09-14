import { Router } from "express";
import * as transactionController from "./transaction.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", authorize("finance:list"), transactionController.listTransactions);

export default router;
