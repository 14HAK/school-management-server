import { Router } from "express";
import * as teacherController from "./teacher.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createTeacherSchema,
  updateTeacherSchema,
  getTeacherSchema,
} from "./teacher.validation.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize("teacher:create"), validate(createTeacherSchema), teacherController.createTeacher);
router.get("/", authorize("teacher:list"), teacherController.listTeachers);
router.get("/:id", authorize("teacher:read"), validate(getTeacherSchema), teacherController.getTeacher);
router.patch(
  "/:id",
  authorize("teacher:update"),
  validate(updateTeacherSchema),
  teacherController.updateTeacher
);
router.delete(
  "/:id",
  authorize("teacher:delete"),
  validate(getTeacherSchema),
  teacherController.deleteTeacher
);

export default router;
