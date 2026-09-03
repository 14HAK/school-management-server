import Academy from "./academy.model.js";
import ApiError from "../../shared/ApiError.js";

export const createAcademy = async (payload) => {
  const existing = await Academy.findOne({
    buildingName: payload.buildingName,
    roomNumber: payload.roomNumber,
    isDeleted: false,
  });
  if (existing) {
    throw ApiError.conflict(
      `Room ${payload.roomNumber} already exists in ${payload.buildingName}.`
    );
  }

  return Academy.create(payload);
};

export const listAcademies = async ({
  page,
  limit,
  buildingName,
  floor,
  roomType,
  status,
  search,
  sort,
}) => {
  const filter = { isDeleted: false };
  if (buildingName) filter.buildingName = buildingName;
  if (floor) filter.floor = floor;
  if (roomType) filter.roomType = roomType;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { roomNumber: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    Academy.find(filter)
      .populate("relatedUsers", "email profileType")
      .sort(sort || "buildingName roomNumber")
      .skip((page - 1) * limit)
      .limit(limit),
    Academy.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getAcademyById = async (id) => {
  const room = await Academy.findOne({ _id: id, isDeleted: false }).populate(
    "relatedUsers",
    "email profileType"
  );
  if (!room) throw ApiError.notFound("Room not found.");
  return room;
};

export const updateAcademy = async (id, updates) => {
  const room = await Academy.findOne({ _id: id, isDeleted: false });
  if (!room) throw ApiError.notFound("Room not found.");

  // Re-check uniqueness if building/room number is changing
  if (updates.buildingName || updates.roomNumber) {
    const nextBuilding = updates.buildingName || room.buildingName;
    const nextRoomNumber = updates.roomNumber || room.roomNumber;
    const clash = await Academy.findOne({
      _id: { $ne: id },
      buildingName: nextBuilding,
      roomNumber: nextRoomNumber,
      isDeleted: false,
    });
    if (clash) {
      throw ApiError.conflict(`Room ${nextRoomNumber} already exists in ${nextBuilding}.`);
    }
  }

  Object.assign(room, updates);
  await room.save();
  return room;
};

/** Soft delete — per 02-database-design.md, hard delete is Super Admin-only elsewhere. */
export const deleteAcademy = async (id) => {
  const room = await Academy.findOne({ _id: id, isDeleted: false });
  if (!room) throw ApiError.notFound("Room not found.");

  room.isDeleted = true;
  room.status = "CLOSED";
  await room.save();
};

/** GET /academies/buildings — distinct buildings with room + capacity stats */
export const listBuildings = async () => {
  return Academy.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$buildingName",
        totalRooms: { $sum: 1 },
        totalCapacity: { $sum: "$capacity" },
        floors: { $addToSet: "$floor" },
      },
    },
    { $project: { _id: 0, buildingName: "$_id", totalRooms: 1, totalCapacity: 1, floors: 1 } },
    { $sort: { buildingName: 1 } },
  ]);
};

/** GET /academies/floors — distinct floors, optionally scoped to a building */
export const listFloors = async ({ buildingName }) => {
  const match = { isDeleted: false };
  if (buildingName) match.buildingName = buildingName;

  return Academy.aggregate([
    { $match: match },
    {
      $group: {
        _id: { buildingName: "$buildingName", floor: "$floor" },
        totalRooms: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        buildingName: "$_id.buildingName",
        floor: "$_id.floor",
        totalRooms: 1,
      },
    },
    { $sort: { buildingName: 1, floor: 1 } },
  ]);
};

/** GET /academies/rooms — same listing as the main index, kept as an explicit alias per spec */
export const listRooms = (params) => listAcademies(params);
