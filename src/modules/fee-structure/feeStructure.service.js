import FeeStructure from "./feeStructure.model.js";
import ApiError from "../../shared/ApiError.js";

export const createFeeStructure = async (payload) => {
  const existing = await FeeStructure.findOne({
    academicYearId: payload.academicYearId,
    classId: payload.classId,
    groupId: payload.groupId || null,
    name: payload.name,
    isDeleted: false,
  });
  if (existing) {
    throw ApiError.conflict(`A fee structure named "${payload.name}" already exists for this scope.`);
  }

  return FeeStructure.create(payload);
};

export const listFeeStructures = async ({ page, limit, academicYearId, classId, status, sort }) => {
  const filter = { isDeleted: false };
  if (academicYearId) filter.academicYearId = academicYearId;
  if (classId) filter.classId = classId;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    FeeStructure.find(filter)
      .populate("academicYearId", "year")
      .populate("classId", "name")
      .populate("groupId", "name")
      .sort(sort || "-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    FeeStructure.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const updateFeeStructure = async (id, updates) => {
  const structure = await FeeStructure.findOne({ _id: id, isDeleted: false });
  if (!structure) throw ApiError.notFound("Fee structure not found.");

  Object.assign(structure, updates);
  await structure.save();
  return structure;
};

/** Soft delete only — fee structures are templates, not executed financial records, so this is allowed unlike payments. */
export const deleteFeeStructure = async (id) => {
  const structure = await FeeStructure.findOne({ _id: id, isDeleted: false });
  if (!structure) throw ApiError.notFound("Fee structure not found.");

  structure.isDeleted = true;
  structure.status = "INACTIVE";
  await structure.save();
};

export const getFeeStructureById = async (id) => {
  const structure = await FeeStructure.findOne({ _id: id, isDeleted: false });
  if (!structure) throw ApiError.notFound("Fee structure not found.");
  return structure;
};
