import { Router } from "express";
import * as feeStructureController from "./feeStructure.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createFeeStructureSchema,
  updateFeeStructureSchema,
  getFeeStructureSchema,
} from "./feeStructure.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize("finance:create"),
  validate(createFeeStructureSchema),
  feeStructureController.createFeeStructure
);
router.get("/", authorize("finance:list"), feeStructureController.listFeeStructures);
router.patch(
  "/:id",
  authorize("finance:update"),
  validate(updateFeeStructureSchema),
  feeStructureController.updateFeeStructure
);
router.delete(
  "/:id",
  authorize("finance:delete"),
  validate(getFeeStructureSchema),
  feeStructureController.deleteFeeStructure
);

export default router;
