import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import * as academyService from "./academy.service.js";

export const createAcademy = asyncHandler(async (req, res) => {
  const room = await academyService.createAcademy(req.body);
  res.status(201).json(new ApiResponse(201, room, "Room created successfully."));
});

export const listAcademies = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await academyService.listAcademies({
    page,
    limit,
    buildingName: req.query.buildingName,
    floor: req.query.floor,
    roomType: req.query.roomType,
    status: req.query.status,
    search: req.query.search,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Rooms fetched."));
});

export const getAcademy = asyncHandler(async (req, res) => {
  const room = await academyService.getAcademyById(req.params.id);
  res.status(200).json(new ApiResponse(200, room, "Room fetched."));
});

export const updateAcademy = asyncHandler(async (req, res) => {
  const room = await academyService.updateAcademy(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, room, "Room updated."));
});

export const deleteAcademy = asyncHandler(async (req, res) => {
  await academyService.deleteAcademy(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Room deleted."));
});

export const listBuildings = asyncHandler(async (req, res) => {
  const buildings = await academyService.listBuildings();
  res.status(200).json(new ApiResponse(200, buildings, "Buildings fetched."));
});

export const listFloors = asyncHandler(async (req, res) => {
  const floors = await academyService.listFloors({ buildingName: req.query.buildingName });
  res.status(200).json(new ApiResponse(200, floors, "Floors fetched."));
});

export const listRooms = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const result = await academyService.listRooms({
    page,
    limit,
    buildingName: req.query.buildingName,
    floor: req.query.floor,
    roomType: req.query.roomType,
    status: req.query.status,
    search: req.query.search,
    sort: req.query.sort,
  });
  res.status(200).json(new ApiResponse(200, result, "Rooms fetched."));
});
