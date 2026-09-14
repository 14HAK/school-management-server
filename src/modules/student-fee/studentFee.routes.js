import { Router } from "express";
import * as studentFeeController from "./studentFee.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createStudentFeeSchema,
  updateStudentFeeSchema,
} from "./studentFee.validation.js";

const router = Router();

router.use(authenticate);

router.get(
  "/student/:studentId",
  authorize("finance:list"),
  studentFeeController.listStudentFeesByStudent
);

router.post(
  "/",
  authorize("finance:create"),
  validate(createStudentFeeSchema),
  studentFeeController.createStudentFee
);
router.get("/", authorize("finance:list"), studentFeeController.listStudentFees);
router.patch(
  "/:id",
  authorize("finance:update"),
  validate(updateStudentFeeSchema),
  studentFeeController.updateStudentFee
);

export default router;
