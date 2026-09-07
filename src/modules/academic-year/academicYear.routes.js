import { Router } from "express";
import * as academicYearController from "./academicYear.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
  getAcademicYearSchema,
} from "./academicYear.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("academic:create"),
  validate(createAcademicYearSchema),
  academicYearController.createAcademicYear
);
router.get("/", authorize("academic:list"), academicYearController.listAcademicYears);
router.get(
  "/:id",
  authorize("academic:read"),
  validate(getAcademicYearSchema),
  academicYearController.getAcademicYear
);
router.patch(
  "/:id",
  authorize("academic:update"),
  validate(updateAcademicYearSchema),
  academicYearController.updateAcademicYear
);
router.delete(
  "/:id",
  authorize("academic:delete"),
  validate(getAcademicYearSchema),
  academicYearController.deleteAcademicYear
);

export default router;
