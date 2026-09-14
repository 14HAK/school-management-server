import asyncHandler from "../../shared/asyncHandler.js";
import ApiResponse from "../../shared/ApiResponse.js";
import ApiError from "../../shared/ApiError.js";
import Invoice from "./invoice.model.js";

/** GET /api/v1/invoices/:invoiceNumber — looked up by unique invoice number, per spec. */
export const getInvoiceByNumber = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber }).populate(
    "studentId",
    "studentId personalInfo.fullName"
  );
  if (!invoice) throw ApiError.notFound("Invoice not found.");
  res.status(200).json(new ApiResponse(200, invoice, "Invoice fetched."));
});
