import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as assignmentService from "./teacherAssignment.service.js";

export const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.createAssignment(req.body);
  res.status(201).json(new ApiResponse(201, assignment, "Teacher assignment created."));
});

export const listAssignments = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await assignmentService.listAssignments({
    page,
    limit,
    teacherId: req.query.teacherId,
    academicYearId: req.query.academicYearId,
    classId: req.query.classId,
    sectionId: req.query.sectionId,
    subjectId: req.query.subjectId,
    status: req.query.status,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Teacher assignments fetched."));
});

export const getAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.getAssignmentById(req.params.id);
  res.status(200).json(new ApiResponse(200, assignment, "Teacher assignment fetched."));
});

export const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.updateAssignment(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, assignment, "Teacher assignment updated."));
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  await assignmentService.deleteAssignment(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Teacher assignment deleted."));
});

export const listAssignmentsByTeacher = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.listAssignmentsByTeacher(req.params.teacherId);
  res.status(200).json(new ApiResponse(200, assignments, "Assignments fetched for teacher."));
});

export const listAssignmentsByClass = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.listAssignmentsByClass(req.params.classId);
  res.status(200).json(new ApiResponse(200, assignments, "Assignments fetched for class."));
});

export const listAssignmentsBySubject = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.listAssignmentsBySubject(req.params.subjectId);
  res.status(200).json(new ApiResponse(200, assignments, "Assignments fetched for subject."));
});
