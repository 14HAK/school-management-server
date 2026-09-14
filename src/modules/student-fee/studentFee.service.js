import mongoose from "mongoose";
import StudentFee from "./studentFee.model.js";
import FeeStructure from "../fee-structure/feeStructure.model.js";
import StudentEnrollment from "../student-enrollment/studentEnrollment.model.js";
import Invoice from "../invoice/invoice.model.js";
import ApiError from "../../shared/ApiError.js";
import { generateInvoiceNumber } from "../../utils/idGenerator.util.js";

const withTransaction = async (callback) => {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await callback(session);
    });
    return result;
  } finally {
    session.endSession();
  }
};

const computeDueAmount = (fee) => Math.max(0, fee.amount - fee.discount + fee.fine - fee.paidAmount);

const computeStatus = (fee) => {
  if (fee.status === "CANCELLED") return "CANCELLED";
  const due = computeDueAmount(fee);
  if (due <= 0) return "PAID";
  if (fee.paidAmount > 0) return "PARTIAL";
  return "PENDING";
};

/** Fee Structure must exist and student must have an active enrollment, per spec's validation rules. */
export const createStudentFee = async ({ studentId, academicYearId, feeStructureId, discount = 0, fine = 0 }) => {
  const feeStructure = await FeeStructure.findOne({ _id: feeStructureId, isDeleted: false });
  if (!feeStructure) throw ApiError.badRequest("Fee structure not found.");

  const enrollment = await StudentEnrollment.findOne({
    studentId,
    academicYearId,
    status: "ACTIVE",
    isDeleted: false,
  });
  if (!enrollment) throw ApiError.badRequest("Student does not have an active enrollment for this academic year.");

  const { fee, invoice } = await withTransaction(async (session) => {
    const amount = feeStructure.amount;
    const dueAmount = Math.max(0, amount - discount + fine);

    const [fee] = await StudentFee.create(
      [
        {
          studentId,
          academicYearId,
          feeStructureId,
          amount,
          discount,
          fine,
          paidAmount: 0,
          dueAmount,
          status: dueAmount <= 0 ? "PAID" : "PENDING",
        },
      ],
      { session }
    );

    const invoiceNumber = await generateInvoiceNumber();
    const [invoice] = await Invoice.create(
      [
        {
          invoiceNumber,
          studentFeeId: fee._id,
          studentId,
          amount: dueAmount,
          status: "DRAFT",
        },
      ],
      { session }
    );

    return { fee, invoice };
  });

  return { ...fee.toObject(), invoice };
};

const populateAll = (query) =>
  query
    .populate("studentId", "studentId personalInfo.fullName")
    .populate("academicYearId", "year")
    .populate("feeStructureId", "name amount");

export const listStudentFees = async ({ page, limit, studentId, academicYearId, status, sort }) => {
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (academicYearId) filter.academicYearId = academicYearId;
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    populateAll(StudentFee.find(filter))
      .sort(sort || "-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    StudentFee.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const listStudentFeesByStudent = (studentId) =>
  populateAll(StudentFee.find({ studentId })).sort("-createdAt");

export const getStudentFeeById = async (id) => {
  const fee = await populateAll(StudentFee.findById(id));
  if (!fee) throw ApiError.notFound("Student fee not found.");
  return fee;
};

/** Corrections append an adjustment entry rather than silently overwriting, per spec. */
export const updateStudentFee = async (id, { discount, fine, status, reason }, changedBy) => {
  const fee = await StudentFee.findById(id);
  if (!fee) throw ApiError.notFound("Student fee not found.");

  if (discount !== undefined && discount !== fee.discount) {
    fee.adjustments.push({ field: "discount", previousValue: fee.discount, newValue: discount, changedBy, reason });
    fee.discount = discount;
  }
  if (fine !== undefined && fine !== fee.fine) {
    fee.adjustments.push({ field: "fine", previousValue: fee.fine, newValue: fine, changedBy, reason });
    fee.fine = fine;
  }

  fee.dueAmount = computeDueAmount(fee);
  fee.status = status || computeStatus(fee);
  await fee.save();
  return fee;
};
