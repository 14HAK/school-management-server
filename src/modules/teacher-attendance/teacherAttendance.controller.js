import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as attendanceService from "./teacherAttendance.service.js";

export const createAttendance = asyncHandler(async (req, res) => {
  const record = await attendanceService.createAttendance(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, record, "Attendance marked."));
});

export const listAttendance = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(200, Number(req.query.limit) || 50);
  const result = await attendanceService.listAttendance({
    page,
    limit,
    teacherId: req.query.teacherId,
    date: req.query.date,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    status: req.query.status,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Attendance records fetched."));
});

export const getAttendance = asyncHandler(async (req, res) => {
  const record = await attendanceService.getAttendanceById(req.params.id);
  res.status(200).json(new ApiResponse(200, record, "Attendance record fetched."));
});

export const updateAttendance = asyncHandler(async (req, res) => {
  const record = await attendanceService.updateAttendance(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, record, "Attendance record updated."));
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  await attendanceService.deleteAttendance(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Attendance record deleted."));
});
