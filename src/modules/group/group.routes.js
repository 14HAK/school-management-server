import { Router } from "express";
import * as groupController from "./group.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", authorize("academic:list"), groupController.listGroups);

export default router;
