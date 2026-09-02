import { Router } from "express";
import * as staffController from "./staff.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createStaffSchema, updateStaffSchema, getStaffSchema } from "./staff.validation.js";

const router = Router();

router.use(authenticate);

router.post("/", authorize("staff:create"), validate(createStaffSchema), staffController.createStaff);
router.get("/", authorize("staff:list"), staffController.listStaff);
router.get("/:id", authorize("staff:read"), validate(getStaffSchema), staffController.getStaff);
router.patch("/:id", authorize("staff:update"), validate(updateStaffSchema), staffController.updateStaff);
router.delete("/:id", authorize("staff:delete"), validate(getStaffSchema), staffController.deleteStaff);

export default router;
