import { Router } from "express";
import * as userController from "./user.controller.js";
import authenticate from "../../middlewares/authenticate.middleware.js";
import authorize from "../../middlewares/authorize.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { updateUserSchema, getUserSchema } from "./user.validation.js";

const router = Router();

router.use(authenticate);

// Self-service — must come before /:id so "profile" isn't parsed as an ID
router.get("/profile", userController.getMyProfile);
router.patch("/profile", userController.updateMyProfile);

router.get("/", authorize("user:list"), userController.listUsers);
router.get("/:id", authorize("user:read"), validate(getUserSchema), userController.getUserById);
router.patch(
  "/:id",
  authorize("user:update"),
  validate(updateUserSchema),
  userController.updateUser
);
router.delete("/:id", authorize("user:delete"), validate(getUserSchema), userController.deleteUser);

export default router;
