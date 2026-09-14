import { Router } from "express";
import * as salaryStructureController from "./salaryStructure.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createSalaryStructureSchema,
  updateSalaryStructureSchema,
} from "./salaryStructure.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("finance:create"),
  validate(createSalaryStructureSchema),
  salaryStructureController.createSalaryStructure
);
router.get("/", authorize("finance:list"), salaryStructureController.listSalaryStructures);
router.patch(
  "/:id",
  authorize("finance:update"),
  validate(updateSalaryStructureSchema),
  salaryStructureController.updateSalaryStructure
);

export default router;
