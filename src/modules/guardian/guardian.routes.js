import { Router } from "express";
import * as guardianController from "./guardian.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createGuardianSchema,
  updateGuardianSchema,
  getGuardianSchema,
} from "./guardian.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("guardian:create"),
  validate(createGuardianSchema),
  guardianController.createGuardian
);
router.get("/", authorize("guardian:list"), guardianController.listGuardians);
router.get(
  "/:id",
  authorize("guardian:read"),
  validate(getGuardianSchema),
  guardianController.getGuardian
);
router.patch(
  "/:id",
  authorize("guardian:update"),
  validate(updateGuardianSchema),
  guardianController.updateGuardian
);

export default router;
