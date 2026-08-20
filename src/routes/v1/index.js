import { Router } from "express";
import ApiResponse from "../../shared/ApiResponse.js";
import authRoutes from "../../modules/auth/auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

// Health check for the v1 API surface.
// Module routers (user, student, teacher, ...) will be
// mounted here in later phases, e.g.:
//   router.use("/students", studentRoutes);
router.get("/health", (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { status: "ok" }, "API v1 is healthy"));
});

export default router;
