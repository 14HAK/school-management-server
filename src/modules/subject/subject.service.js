import Subject from "./subject.model.js";
import ApiError from "../../shared/ApiError.js";

export const createSubject = async (payload) => {
  const codeExists = await Subject.findOne({
    subjectCode: payload.subjectCode.toUpperCase(),
    isDeleted: false,
  });
  if (codeExists) {
    throw ApiError.conflict(`Subject code ${payload.subjectCode} already exists.`);
  }

  const nameExistsInClass = await Subject.findOne({
    classId: payload.classId,
    subjectName: payload.subjectName,
    isDeleted: false,
  });
  if (nameExistsInClass) {
    throw ApiError.conflict(`Subject "${payload.subjectName}" already exists for this class.`);
  }

  return Subject.create(payload);
};

export const listSubjects = async ({ page, limit, classId, group, status, search, sort }) => {
  const filter = { isDeleted: false };
  if (classId) filter.classId = classId;
  if (group) filter.group = group;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { subjectName: { $regex: search, $options: "i" } },
      { subjectNameBn: { $regex: search, $options: "i" } },
      { subjectCode: { $regex: search, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    Subject.find(filter)
      .populate("classId", "name level")
      .populate("group", "name")
      .sort(sort || "subjectName")
      .skip((page - 1) * limit)
      .limit(limit),
    Subject.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getSubjectById = async (id) => {
  const subject = await Subject.findOne({ _id: id, isDeleted: false })
    .populate("classId", "name level")
    .populate("group", "name");
  if (!subject) throw ApiError.notFound("Subject not found.");
  return subject;
};

export const updateSubject = async (id, updates) => {
  const subject = await Subject.findOne({ _id: id, isDeleted: false });
  if (!subject) throw ApiError.notFound("Subject not found.");

  if (updates.subjectCode && updates.subjectCode.toUpperCase() !== subject.subjectCode) {
    const clash = await Subject.findOne({
      subjectCode: updates.subjectCode.toUpperCase(),
      _id: { $ne: id },
      isDeleted: false,
    });
    if (clash) throw ApiError.conflict(`Subject code ${updates.subjectCode} already exists.`);
  }

  if (updates.subjectName || updates.classId) {
    const nextClassId = updates.classId || subject.classId;
    const nextName = updates.subjectName || subject.subjectName;
    const clash = await Subject.findOne({
      classId: nextClassId,
      subjectName: nextName,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (clash) throw ApiError.conflict(`Subject "${nextName}" already exists for this class.`);
  }

  Object.assign(subject, updates);
  await subject.save();
  return subject;
};

export const deleteSubject = async (id) => {
  const subject = await Subject.findOne({ _id: id, isDeleted: false });
  if (!subject) throw ApiError.notFound("Subject not found.");

  subject.isDeleted = true;
  subject.status = "ARCHIVED";
  await subject.save();
};

export const listSubjectsByClass = (classId) =>
  Subject.find({ classId, isDeleted: false, status: "ACTIVE" })
    .populate("group", "name")
    .sort("subjectName");

export const listSubjectsByGroup = (groupId) =>
  Subject.find({ group: groupId, isDeleted: false, status: "ACTIVE" })
    .populate("classId", "name level")
    .sort("subjectName");
