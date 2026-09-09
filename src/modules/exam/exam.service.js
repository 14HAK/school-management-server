import Exam from "./exam.model.js";
import ApiError from "../../shared/ApiError.js";

export const createExam = async (payload) => {
  const existing = await Exam.findOne({
    academicYearId: payload.academicYearId,
    examName: payload.examName,
    isDeleted: false,
  });
  if (existing) {
    throw ApiError.conflict(`An exam named "${payload.examName}" already exists for this academic year.`);
  }

  return Exam.create(payload);
};

export const listExams = async ({ page, limit, academicYearId, examType, status, sort }) => {
  const filter = { isDeleted: false };
  if (academicYearId) filter.academicYearId = academicYearId;
  if (examType) filter.examType = examType;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    Exam.find(filter)
      .populate("academicYearId", "year")
      .sort(sort || "-startDate")
      .skip((page - 1) * limit)
      .limit(limit),
    Exam.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getExamById = async (id) => {
  const exam = await Exam.findOne({ _id: id, isDeleted: false }).populate("academicYearId", "year");
  if (!exam) throw ApiError.notFound("Exam not found.");
  return exam;
};

export const updateExam = async (id, updates) => {
  const exam = await Exam.findOne({ _id: id, isDeleted: false });
  if (!exam) throw ApiError.notFound("Exam not found.");

  if (exam.status === "PUBLISHED" && updates.status !== "ARCHIVED") {
    throw ApiError.badRequest("Published exams cannot be modified, only archived.");
  }

  Object.assign(exam, updates);
  await exam.save();
  return exam;
};

export const deleteExam = async (id) => {
  const exam = await Exam.findOne({ _id: id, isDeleted: false });
  if (!exam) throw ApiError.notFound("Exam not found.");

  if (exam.status === "PUBLISHED") {
    throw ApiError.badRequest("Published exams cannot be deleted. Archive it instead.");
  }

  exam.isDeleted = true;
  await exam.save();
};
