import { Router } from "express";
import * as subjectController from "./subject.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createSubjectSchema,
  updateSubjectSchema,
  getSubjectSchema,
} from "./subject.validation.js";

const router = Router();

router.use(authenticate);

router.get("/class/:classLevel", authorize("subject:list"), subjectController.listSubjectsByClass);
router.get("/group/:group", authorize("subject:list"), subjectController.listSubjectsByGroup);

router.post("/", authorize("subject:create"), validate(createSubjectSchema), subjectController.createSubject);
router.get("/", authorize("subject:list"), subjectController.listSubjects);
router.get("/:id", authorize("subject:read"), validate(getSubjectSchema), subjectController.getSubject);
router.patch(
  "/:id",
  authorize("subject:update"),
  validate(updateSubjectSchema),
  subjectController.updateSubject
);
router.delete(
  "/:id",
  authorize("subject:delete"),
  validate(getSubjectSchema),
  subjectController.deleteSubject
);

export default router;
