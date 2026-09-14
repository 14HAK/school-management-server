import SalaryStructure from "./salaryStructure.model.js";
import ApiError from "../../shared/ApiError.js";

export const createSalaryStructure = async (payload) => {
  // Deactivate any previous ACTIVE structure for this employee — only one current salary at a time.
  await SalaryStructure.updateMany({ employeeId: payload.employeeId, status: "ACTIVE" }, { status: "INACTIVE" });
  return SalaryStructure.create(payload);
};

export const listSalaryStructures = async ({ page, limit, employeeId, status }) => {
  const filter = {};
  if (employeeId) filter.employeeId = employeeId;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    SalaryStructure.find(filter)
      .populate("employeeId", "email")
      .sort("-effectiveDate")
      .skip((page - 1) * limit)
      .limit(limit),
    SalaryStructure.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const updateSalaryStructure = async (id, updates) => {
  const structure = await SalaryStructure.findById(id);
  if (!structure) throw ApiError.notFound("Salary structure not found.");

  Object.assign(structure, updates);
  await structure.save();
  return structure;
};
