import { Router } from "express";
import * as academyController from "./academy.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createAcademySchema,
  updateAcademySchema,
  getAcademySchema,
} from "./academy.validation.js";

const router = Router();

router.use(authenticate);

// Static sub-routes MUST come before "/:id" — otherwise Express would parse
// "buildings"/"floors"/"rooms" as an :id value and 400 on invalid ObjectId.
router.get("/buildings", authorize("building:list"), academyController.listBuildings);
router.get("/floors", authorize("building:list"), academyController.listFloors);
router.get("/rooms", authorize("room:list"), academyController.listRooms);

router.post("/", authorize("room:create"), validate(createAcademySchema), academyController.createAcademy);
router.get("/", authorize("room:list"), academyController.listAcademies);
router.get("/:id", authorize("room:read"), validate(getAcademySchema), academyController.getAcademy);
router.patch(
  "/:id",
  authorize("room:update"),
  validate(updateAcademySchema),
  academyController.updateAcademy
);
router.delete(
  "/:id",
  authorize("room:delete"),
  validate(getAcademySchema),
  academyController.deleteAcademy
);

export default router;
