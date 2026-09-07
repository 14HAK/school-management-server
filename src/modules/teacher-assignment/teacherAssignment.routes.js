import { Router } from "express";
import * as assignmentController from "./teacherAssignment.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  getAssignmentSchema,
} from "./teacherAssignment.validation.js";

const router = Router();

router.use(authenticate);

router.get("/teacher/:teacherId", authorize("assignment:list"), assignmentController.listAssignmentsByTeacher);
router.get("/class/:classId", authorize("assignment:list"), assignmentController.listAssignmentsByClass);
router.get("/subject/:subjectId", authorize("assignment:list"), assignmentController.listAssignmentsBySubject);

router.post(
  "/",
  authorize("assignment:create"),
  validate(createAssignmentSchema),
  assignmentController.createAssignment
);
router.get("/", authorize("assignment:list"), assignmentController.listAssignments);
router.get(
  "/:id",
  authorize("assignment:read"),
  validate(getAssignmentSchema),
  assignmentController.getAssignment
);
router.patch(
  "/:id",
  authorize("assignment:update"),
  validate(updateAssignmentSchema),
  assignmentController.updateAssignment
);
router.delete(
  "/:id",
  authorize("assignment:delete"),
  validate(getAssignmentSchema),
  assignmentController.deleteAssignment
);

export default router;
