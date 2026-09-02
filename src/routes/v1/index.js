import { Router } from "express";
import ApiResponse from "../../shared/ApiResponse.js";
import authRoutes from "../../modules/auth/auth.routes.js";
import userRoutes from "../../modules/user/user.routes.js";
import studentRoutes from "../../modules/student/student.routes.js";
import teacherRoutes from "../../modules/teacher/teacher.routes.js";
import staffRoutes from "../../modules/staff/staff.routes.js";
import guardianRoutes from "../../modules/guardian/guardian.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/staff", staffRoutes);
router.use("/guardians", guardianRoutes);

// Health check for the v1 API surface.
// Remaining module routers (campus, academic, routine, ...) will be
// mounted here in later phases.
router.get("/health", (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { status: "ok" }, "API v1 is healthy"));
});

export default router;
