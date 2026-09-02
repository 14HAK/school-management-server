import { Router } from "express";
import * as studentController from "./student.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createStudentSchema,
  updateStudentSchema,
  getStudentSchema,
} from "./student.validation.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize("student:create"), validate(createStudentSchema), studentController.createStudent);
router.get("/", authorize("student:list"), studentController.listStudents);
router.get("/:id", authorize("student:read"), validate(getStudentSchema), studentController.getStudent);
router.patch(
  "/:id",
  authorize("student:update"),
  validate(updateStudentSchema),
  studentController.updateStudent
);
router.delete(
  "/:id",
  authorize("student:delete"),
  validate(getStudentSchema),
  studentController.deleteStudent
);

export default router;
