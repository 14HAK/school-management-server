import mongoose from "mongoose";

/**
 * The spec's API list only shows POST/GET for salary-payments, with no
 * endpoints for salary-structures despite it being a listed core
 * collection. Without some record of an employee's agreed salary, there
 * would be nothing for a SalaryPayment to reference or default from — this
 * is a documented gap-fill (same pattern as exam-invigilators in Phase 6),
 * not a spec deviation.
 */
const salaryStructureSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    basicSalary: { type: Number, required: true, min: 0 },
    allowance: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    deduction: { type: Number, default: 0, min: 0 },
    netSalary: { type: Number, required: true, min: 0 },
    effectiveDate: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

salaryStructureSchema.pre("validate", function computeNetSalary(next) {
  this.netSalary = Math.max(0, this.basicSalary + this.allowance + this.bonus - this.deduction);
  next();
});

salaryStructureSchema.index({ employeeId: 1, status: 1 });

const SalaryStructure = mongoose.model("SalaryStructure", salaryStructureSchema);

export default SalaryStructure;
