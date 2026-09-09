import { Router } from "express";
import * as markController from "./examMark.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createMarkSchema,
  bulkCreateMarksSchema,
  updateMarkSchema,
} from "./examMark.validation.js";

const router = Router();

router.use(authenticate);

router.post("/bulk", authorize("result:create"), validate(bulkCreateMarksSchema), markController.bulkCreateMarks);

router.post("/", authorize("result:create"), validate(createMarkSchema), markController.createMark);
router.get("/", authorize("result:list"), markController.listMarks);
router.patch("/:id", authorize("result:update"), validate(updateMarkSchema), markController.updateMark);

export default router;
