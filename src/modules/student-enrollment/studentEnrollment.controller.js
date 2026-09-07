import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as enrollmentService from "./studentEnrollment.service.js";

export const createEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.createEnrollment(req.body);
  res.status(201).json(new ApiResponse(201, enrollment, "Student enrolled successfully."));
});

export const listEnrollments = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await enrollmentService.listEnrollments({
    page,
    limit,
    studentId: req.query.studentId,
    academicYearId: req.query.academicYearId,
    classId: req.query.classId,
    sectionId: req.query.sectionId,
    status: req.query.status,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Enrollments fetched."));
});

export const getEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.getEnrollmentById(req.params.id);
  res.status(200).json(new ApiResponse(200, enrollment, "Enrollment fetched."));
});

export const updateEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollment(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, enrollment, "Enrollment updated."));
});

export const deleteEnrollment = asyncHandler(async (req, res) => {
  await enrollmentService.deleteEnrollment(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Enrollment deleted."));
});

export const promoteEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.promoteEnrollment(req.body);
  res.status(201).json(new ApiResponse(201, enrollment, "Student promoted successfully."));
});

export const transferEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.transferEnrollment(req.body);
  res.status(201).json(new ApiResponse(201, enrollment, "Student transferred successfully."));
});

export const listEnrollmentsByStudent = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.listEnrollmentsByStudent(req.params.studentId);
  res.status(200).json(new ApiResponse(200, enrollments, "Enrollment history fetched."));
});
