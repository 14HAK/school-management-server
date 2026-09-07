import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as subjectService from "./subject.service.js";

export const createSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.createSubject(req.body);
  res.status(201).json(new ApiResponse(201, subject, "Subject created successfully."));
});

export const listSubjects = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await subjectService.listSubjects({
    page,
    limit,
    classId: req.query.classId,
    group: req.query.group,
    status: req.query.status,
    search: req.query.search,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Subjects fetched."));
});

export const getSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.getSubjectById(req.params.id);
  res.status(200).json(new ApiResponse(200, subject, "Subject fetched."));
});

export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await subjectService.updateSubject(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, subject, "Subject updated."));
});

export const deleteSubject = asyncHandler(async (req, res) => {
  await subjectService.deleteSubject(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Subject deleted."));
});

export const listSubjectsByClass = asyncHandler(async (req, res) => {
  const subjects = await subjectService.listSubjectsByClass(req.params.classLevel);
  res.status(200).json(new ApiResponse(200, subjects, "Subjects fetched for class."));
});

export const listSubjectsByGroup = asyncHandler(async (req, res) => {
  const subjects = await subjectService.listSubjectsByGroup(req.params.group);
  res.status(200).json(new ApiResponse(200, subjects, "Subjects fetched for group."));
});
