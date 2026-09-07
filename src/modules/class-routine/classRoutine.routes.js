import { Router } from "express";
import * as routineController from "./classRoutine.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createRoutineSchema,
  updateRoutineSchema,
  getRoutineSchema,
  generateRoutineSchema,
  publishRoutineSchema,
  lockRoutineSchema,
} from "./classRoutine.validation.js";

const router = Router();

router.use(authenticate);

// Static/action routes MUST come before "/:id".
router.post(
  "/generate",
  authorize("routine:assign"),
  validate(generateRoutineSchema),
  routineController.generateRoutine
);
router.post(
  "/publish",
  authorize("routine:publish"),
  validate(publishRoutineSchema),
  routineController.publishRoutine
);
router.post("/lock", authorize("routine:update"), validate(lockRoutineSchema), routineController.lockRoutine);
router.post(
  "/unlock",
  authorize("routine:update"),
  validate(lockRoutineSchema),
  routineController.unlockRoutine
);
router.get("/conflicts", authorize("routine:read"), routineController.checkConflicts);
router.get("/class/:classId", authorize("routine:list"), routineController.listRoutineByClass);
router.get("/teacher/:teacherId", authorize("routine:list"), routineController.listRoutineByTeacher);
router.get("/room/:roomId", authorize("routine:list"), routineController.listRoutineByRoom);

router.post(
  "/",
  authorize("routine:create"),
  validate(createRoutineSchema),
  routineController.createRoutineEntry
);
router.get("/", authorize("routine:list"), routineController.listRoutineEntries);
router.get("/:id", authorize("routine:read"), validate(getRoutineSchema), routineController.getRoutineEntry);
router.patch(
  "/:id",
  authorize("routine:update"),
  validate(updateRoutineSchema),
  routineController.updateRoutineEntry
);
router.delete(
  "/:id",
  authorize("routine:delete"),
  validate(getRoutineSchema),
  routineController.deleteRoutineEntry
);

export default router;
