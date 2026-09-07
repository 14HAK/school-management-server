import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as routineService from "./classRoutine.service.js";

export const createRoutineEntry = asyncHandler(async (req, res) => {
  const entry = await routineService.createRoutineEntry(req.body);
  res.status(201).json(new ApiResponse(201, entry, "Routine entry created."));
});

export const listRoutineEntries = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(200, Number(req.query.limit) || 50);
  const result = await routineService.listRoutineEntries({
    page,
    limit,
    academicYearId: req.query.academicYearId,
    classId: req.query.classId,
    sectionId: req.query.sectionId,
    groupId: req.query.groupId,
    day: req.query.day,
    status: req.query.status,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Routine entries fetched."));
});

export const getRoutineEntry = asyncHandler(async (req, res) => {
  const entry = await routineService.getRoutineEntryById(req.params.id);
  res.status(200).json(new ApiResponse(200, entry, "Routine entry fetched."));
});

export const updateRoutineEntry = asyncHandler(async (req, res) => {
  const entry = await routineService.updateRoutineEntry(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, entry, "Routine entry updated."));
});

export const deleteRoutineEntry = asyncHandler(async (req, res) => {
  await routineService.deleteRoutineEntry(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Routine entry deleted."));
});

export const listRoutineByClass = asyncHandler(async (req, res) => {
  const entries = await routineService.listRoutineByClass(req.params.classId);
  res.status(200).json(new ApiResponse(200, entries, "Routine fetched for class."));
});

export const listRoutineByTeacher = asyncHandler(async (req, res) => {
  const entries = await routineService.listRoutineByTeacher(req.params.teacherId);
  res.status(200).json(new ApiResponse(200, entries, "Routine fetched for teacher."));
});

export const listRoutineByRoom = asyncHandler(async (req, res) => {
  const entries = await routineService.listRoutineByRoom(req.params.roomId);
  res.status(200).json(new ApiResponse(200, entries, "Routine fetched for room."));
});

export const generateRoutine = asyncHandler(async (req, res) => {
  const result = await routineService.generateRoutine(req.body);
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        result,
        `Generated ${result.created.length} routine entries${
          result.skipped.length > 0 ? `, ${result.skipped.length} could not be placed` : ""
        }.`
      )
    );
});

export const publishRoutine = asyncHandler(async (req, res) => {
  const result = await routineService.publishRoutine(req.body);
  res.status(200).json(new ApiResponse(200, result, "Routine published."));
});

export const lockRoutine = asyncHandler(async (req, res) => {
  const result = await routineService.lockRoutine(req.body);
  res.status(200).json(new ApiResponse(200, result, "Routine locked."));
});

export const unlockRoutine = asyncHandler(async (req, res) => {
  const result = await routineService.unlockRoutine(req.body);
  res.status(200).json(new ApiResponse(200, result, "Routine unlocked."));
});

export const checkConflicts = asyncHandler(async (req, res) => {
  const conflicts = await routineService.checkConflicts(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, conflicts, conflicts.length === 0 ? "No conflicts found." : "Conflicts found."));
});
