# Finance Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 06-user-management.md
- 08-academic.md
- 11-student-enrollment.md

---

# Purpose

This document defines the financial management system of the School ERP.

The finance module manages student fees, employee salaries, income, expenses and financial reporting.

---

# Core Collections

feeStructures

studentFees

payments

salaryStructures

salaryPayments

expenses

incomeCategories

expenseCategories

transactions

receipts

invoices

---

# Fee Structure

Collection

feeStructures

Fields

_id

name

academicYearId

classId

groupId

amount

description

status

createdAt

updatedAt

---

# Student Fee

Collection

studentFees

Fields

_id

studentId

academicYearId

feeStructureId

amount

discount

fine

paidAmount

dueAmount

status

createdAt

updatedAt

---

# Payment

Collection

payments

Fields

_id

studentFeeId

paymentMethod

transactionId

amount

paymentDate

receivedBy

remarks

status

createdAt

---

# Salary Structure

Collection

salaryStructures

Fields

_id

employeeId

basicSalary

allowance

bonus

deduction

netSalary

effectiveDate

status

---

# Salary Payment

Collection

salaryPayments

Fields

_id

employeeId

salaryStructureId

paymentMonth

paymentDate

amount

paymentMethod

status

---

# Expense

Collection

expenses

Fields

_id

categoryId

amount

expenseDate

paidBy

description

status

---

# Income Category

Examples

Admission Fee

Monthly Fee

Exam Fee

Library Fee

Transport Fee

Hostel Fee

Donation

Others

---

# Expense Category

Examples

Salary

Electric Bill

Internet Bill

Stationery

Maintenance

Cleaning

Lab Equipment

Fuel

Others

---

# Transaction

Collection

transactions

Fields

_id

referenceType

referenceId

transactionType

amount

transactionDate

status

---

# Receipt

A receipt is generated for every successful payment.

Receipt Number must be unique.

---

# Invoice

Invoices may be generated before payment.

Invoice Status

DRAFT

SENT

PAID

CANCELLED

---

# Payment Methods

Cash

Bank Transfer

Mobile Banking

Card

Online Payment

Cheque

---

# Fee Status

PENDING

PARTIAL

PAID

OVERDUE

CANCELLED

---

# Salary Status

PENDING

PAID

CANCELLED

---

# APIs

POST /api/v1/fee-structures

GET /api/v1/fee-structures

PATCH /api/v1/fee-structures/:id

DELETE /api/v1/fee-structures/:id

---

POST /api/v1/student-fees

GET /api/v1/student-fees

GET /api/v1/student-fees/student/:studentId

PATCH /api/v1/student-fees/:id

---

POST /api/v1/payments

GET /api/v1/payments

GET /api/v1/payments/:id

---

POST /api/v1/salary-payments

GET /api/v1/salary-payments

---

POST /api/v1/expenses

GET /api/v1/expenses

---

GET /api/v1/transactions

GET /api/v1/receipts/:receiptNumber

GET /api/v1/invoices/:invoiceNumber

---

# Validation Rules

Fee Structure must exist before assigning fees.

Student must have an active enrollment.

Payment Amount cannot exceed Due Amount.

Receipt Number must be unique.

Invoice Number must be unique.

Salary cannot be negative.

Expense Amount must be greater than zero.

---

# Business Rules

Every successful payment creates:

- Payment Record
- Transaction Record
- Receipt

Deleting financial records is prohibited.

Corrections must be recorded through adjustment entries.

All financial reports must use transaction history.

---

# Future Scope

Support

Installment Payments

Auto Fine Calculation

Scholarships

Waivers

Payroll Tax

Budget Planning

Accounting Ledger

Online Payment Gateway

Bank Reconciliation

without redesign.

---

Status

Draft