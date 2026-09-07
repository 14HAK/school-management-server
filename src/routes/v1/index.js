import { Router } from "express";
import ApiResponse from "../../shared/ApiResponse.js";
import authRoutes from "../../modules/auth/auth.routes.js";
import userRoutes from "../../modules/user/user.routes.js";
import studentRoutes from "../../modules/student/student.routes.js";
import teacherRoutes from "../../modules/teacher/teacher.routes.js";
import staffRoutes from "../../modules/staff/staff.routes.js";
import guardianRoutes from "../../modules/guardian/guardian.routes.js";
import academyRoutes from "../../modules/academy/academy.routes.js";
import academicYearRoutes from "../../modules/academic-year/academicYear.routes.js";
import classRoutes from "../../modules/class/class.routes.js";
import sectionRoutes from "../../modules/section/section.routes.js";
import groupRoutes from "../../modules/group/group.routes.js";
import subjectRoutes from "../../modules/subject/subject.routes.js";
import teacherAssignmentRoutes from "../../modules/teacher-assignment/teacherAssignment.routes.js";
import studentEnrollmentRoutes from "../../modules/student-enrollment/studentEnrollment.routes.js";
import periodRoutes from "../../modules/period/period.routes.js";
import classRoutineRoutes from "../../modules/class-routine/classRoutine.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/staff", staffRoutes);
router.use("/guardians", guardianRoutes);
router.use("/academies", academyRoutes);
router.use("/academic-years", academicYearRoutes);
router.use("/classes", classRoutes);
router.use("/sections", sectionRoutes);
router.use("/groups", groupRoutes);
router.use("/subjects", subjectRoutes);
router.use("/teacher-assignments", teacherAssignmentRoutes);
router.use("/student-enrollments", studentEnrollmentRoutes);
router.use("/periods", periodRoutes);
router.use("/class-routines", classRoutineRoutes);

// Health check for the v1 API surface.
// Remaining module routers (exam, finance, ...) will be
// mounted here in later phases.
router.get("/health", (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { status: "ok" }, "API v1 is healthy"));
});

export default router;
