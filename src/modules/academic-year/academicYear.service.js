import AcademicYear from "./academicYear.model.js";
import ApiError from "../../shared/ApiError.js";

/** Only one Academic Year can be ACTIVE at a time — deactivates any other ACTIVE year. */
const enforceSingleActive = async (excludeId) => {
  const filter = { status: "ACTIVE", isDeleted: false };
  if (excludeId) filter._id = { $ne: excludeId };
  await AcademicYear.updateMany(filter, { status: "INACTIVE" });
};

export const createAcademicYear = async (payload) => {
  const existing = await AcademicYear.findOne({ year: payload.year, isDeleted: false });
  if (existing) {
    throw ApiError.conflict(`Academic year ${payload.year} already exists.`);
  }

  if (payload.status === "ACTIVE") {
    await enforceSingleActive();
  }

  return AcademicYear.create(payload);
};

export const listAcademicYears = async ({ page, limit, status, sort }) => {
  const filter = { isDeleted: false };
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    AcademicYear.find(filter)
      .sort(sort || "-year")
      .skip((page - 1) * limit)
      .limit(limit),
    AcademicYear.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getAcademicYearById = async (id) => {
  const year = await AcademicYear.findOne({ _id: id, isDeleted: false });
  if (!year) throw ApiError.notFound("Academic year not found.");
  return year;
};

export const updateAcademicYear = async (id, updates) => {
  const year = await AcademicYear.findOne({ _id: id, isDeleted: false });
  if (!year) throw ApiError.notFound("Academic year not found.");

  if (updates.year && updates.year !== year.year) {
    const clash = await AcademicYear.findOne({
      year: updates.year,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (clash) throw ApiError.conflict(`Academic year ${updates.year} already exists.`);
  }

  if (updates.status === "ACTIVE" && year.status !== "ACTIVE") {
    await enforceSingleActive(id);
  }

  Object.assign(year, updates);
  await year.save();
  return year;
};

/** Soft delete — academic years are historical records, never hard-deleted via this route. */
export const deleteAcademicYear = async (id) => {
  const year = await AcademicYear.findOne({ _id: id, isDeleted: false });
  if (!year) throw ApiError.notFound("Academic year not found.");

  if (year.status === "ACTIVE") {
    throw ApiError.badRequest(
      "Cannot delete the active academic year. Set another year active first."
    );
  }

  year.isDeleted = true;
  await year.save();
};

export const getActiveAcademicYear = () =>
  AcademicYear.findOne({ status: "ACTIVE", isDeleted: false });
