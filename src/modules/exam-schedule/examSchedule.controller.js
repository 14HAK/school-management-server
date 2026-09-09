import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as scheduleService from "./examSchedule.service.js";

export const createSchedule = asyncHandler(async (req, res) => {
  const schedule = await scheduleService.createSchedule(req.body);
  res.status(201).json(new ApiResponse(201, schedule, "Exam schedule created."));
});

export const listSchedules = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await scheduleService.listSchedules({
    page,
    limit,
    examId: req.query.examId,
    classId: req.query.classId,
    sectionId: req.query.sectionId,
    status: req.query.status,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Exam schedules fetched."));
});

export const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await scheduleService.getScheduleById(req.params.id);
  res.status(200).json(new ApiResponse(200, schedule, "Exam schedule fetched."));
});

export const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, schedule, "Exam schedule updated."));
});

export const deleteSchedule = asyncHandler(async (req, res) => {
  await scheduleService.deleteSchedule(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Exam schedule deleted."));
});

export const addInvigilator = asyncHandler(async (req, res) => {
  const invigilator = await scheduleService.addInvigilator(req.params.id, req.body);
  res.status(201).json(new ApiResponse(201, invigilator, "Invigilator assigned."));
});

export const removeInvigilator = asyncHandler(async (req, res) => {
  await scheduleService.removeInvigilator(req.params.id, req.params.invigilatorId);
  res.status(200).json(new ApiResponse(200, null, "Invigilator removed."));
});
