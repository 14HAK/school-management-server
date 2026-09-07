import { Router } from "express";
import * as classController from "./class.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", authorize("academic:list"), classController.listClasses);

export default router;
