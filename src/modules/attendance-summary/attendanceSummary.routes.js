import { Router } from "express";
import * as summaryController from "./attendanceSummary.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/class", authorize("attendance:read"), summaryController.getClassDailySummary);
router.get("/student/:studentId/monthly", authorize("attendance:read"), summaryController.getStudentDailySummary);
router.get("/student/:studentId/yearly", authorize("attendance:read"), summaryController.getStudentYearlySummary);

export default router;
