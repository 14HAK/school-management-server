import { Router } from "express";
import * as resultController from "./examResult.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  generateResultsSchema,
  publishResultsSchema,
  getResultsByStudentSchema,
} from "./examResult.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/generate",
  authorize("result:create"),
  validate(generateResultsSchema),
  resultController.generateResults
);
router.post(
  "/publish",
  authorize("result:publish"),
  validate(publishResultsSchema),
  resultController.publishResults
);
router.get(
  "/student/:studentId",
  authorize("result:read"),
  validate(getResultsByStudentSchema),
  resultController.getResultsByStudent
);

export default router;
