import { Router } from "express";
import * as enrollmentController from "./studentEnrollment.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  getEnrollmentSchema,
  promoteEnrollmentSchema,
  transferEnrollmentSchema,
} from "./studentEnrollment.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/promote",
  authorize("enrollment:assign"),
  validate(promoteEnrollmentSchema),
  enrollmentController.promoteEnrollment
);
router.post(
  "/transfer",
  authorize("enrollment:assign"),
  validate(transferEnrollmentSchema),
  enrollmentController.transferEnrollment
);
router.get(
  "/student/:studentId",
  authorize("enrollment:list"),
  enrollmentController.listEnrollmentsByStudent
);

router.post(
  "/",
  authorize("enrollment:create"),
  validate(createEnrollmentSchema),
  enrollmentController.createEnrollment
);
router.get("/", authorize("enrollment:list"), enrollmentController.listEnrollments);
router.get(
  "/:id",
  authorize("enrollment:read"),
  validate(getEnrollmentSchema),
  enrollmentController.getEnrollment
);
router.patch(
  "/:id",
  authorize("enrollment:update"),
  validate(updateEnrollmentSchema),
  enrollmentController.updateEnrollment
);
router.delete(
  "/:id",
  authorize("enrollment:delete"),
  validate(getEnrollmentSchema),
  enrollmentController.deleteEnrollment
);

export default router;
