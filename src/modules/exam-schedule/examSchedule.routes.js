import { Router } from "express";
import * as scheduleController from "./examSchedule.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createScheduleSchema,
  updateScheduleSchema,
  getScheduleSchema,
  addInvigilatorSchema,
  removeInvigilatorSchema,
} from "./examSchedule.validation.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize("exam:create"), validate(createScheduleSchema), scheduleController.createSchedule);
router.get("/", authorize("exam:list"), scheduleController.listSchedules);
router.get("/:id", authorize("exam:read"), validate(getScheduleSchema), scheduleController.getSchedule);
router.patch(
  "/:id",
  authorize("exam:update"),
  validate(updateScheduleSchema),
  scheduleController.updateSchedule
);
router.delete(
  "/:id",
  authorize("exam:delete"),
  validate(getScheduleSchema),
  scheduleController.deleteSchedule
);

// Nested invigilator management — the spec defines the examInvigilators
// collection and its fields but doesn't list a top-level API for it, so
// it's exposed here under its owning schedule.
router.post(
  "/:id/invigilators",
  authorize("exam:assign"),
  validate(addInvigilatorSchema),
  scheduleController.addInvigilator
);
router.delete(
  "/:id/invigilators/:invigilatorId",
  authorize("exam:assign"),
  validate(removeInvigilatorSchema),
  scheduleController.removeInvigilator
);

export default router;
