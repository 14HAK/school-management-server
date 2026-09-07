import { Router } from "express";
import * as periodController from "./period.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", authorize("routine:list"), periodController.listPeriods);

export default router;
