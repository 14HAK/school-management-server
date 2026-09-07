import { Router } from "express";
import * as sectionController from "./section.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", authorize("academic:list"), sectionController.listSections);

export default router;
