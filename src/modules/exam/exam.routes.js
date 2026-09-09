import { Router } from "express";
import * as examController from "./exam.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createExamSchema, updateExamSchema, getExamSchema } from "./exam.validation.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize("exam:create"), validate(createExamSchema), examController.createExam);
router.get("/", authorize("exam:list"), examController.listExams);
router.get("/:id", authorize("exam:read"), validate(getExamSchema), examController.getExam);
router.patch("/:id", authorize("exam:update"), validate(updateExamSchema), examController.updateExam);
router.delete("/:id", authorize("exam:delete"), validate(getExamSchema), examController.deleteExam);

export default router;
