import { Router } from "express";
import * as attendanceController from "./teacherAttendance.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  getAttendanceSchema,
} from "./teacherAttendance.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("attendance:create"),
  validate(createAttendanceSchema),
  attendanceController.createAttendance
);
router.get("/", authorize("attendance:list"), attendanceController.listAttendance);
router.get(
  "/:id",
  authorize("attendance:read"),
  validate(getAttendanceSchema),
  attendanceController.getAttendance
);
router.patch(
  "/:id",
  authorize("attendance:update"),
  validate(updateAttendanceSchema),
  attendanceController.updateAttendance
);
router.delete(
  "/:id",
  authorize("attendance:delete"),
  validate(getAttendanceSchema),
  attendanceController.deleteAttendance
);

export default router;
