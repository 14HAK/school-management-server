# Report System

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 06-user-management.md
- 08-academic.md
- 11-student-enrollment.md
- 13-exam-engine.md
- 14-attendance.md
- 15-finance.md
- 16-library.md
- 17-transport.md
- 18-hostel.md

---

# Purpose

This document defines the reporting and analytics system of the School ERP.

The reporting module collects data from all business modules and generates printable and exportable reports.

---

# Core Collections

reportTemplates

reportSchedules

reportExports

---

# Report Template

Collection

reportTemplates

Fields

_id

name

module

description

filters

exportFormats

status

createdAt

updatedAt

---

# Report Schedule

Collection

reportSchedules

Fields

_id

reportTemplateId

frequency

nextRunAt

lastRunAt

recipientIds

status

createdAt

updatedAt

---

# Report Export

Collection

reportExports

Fields

_id

reportTemplateId

generatedBy

fileType

fileName

fileSize

downloadUrl

generatedAt

expiresAt

status

---

# Report Categories

Academic

Student

Teacher

Staff

Attendance

Examination

Result

Finance

Library

Transport

Hostel

System

Custom

---

# Academic Reports

Student List

Class List

Section List

Enrollment Summary

Promotion Report

Transfer Report

---

# Attendance Reports

Daily Attendance

Monthly Attendance

Yearly Attendance

Late Report

Leave Report

Attendance Percentage

---

# Examination Reports

Exam Schedule

Subject-wise Marks

Class Result

Top Students

Fail List

GPA Summary

Transcript

---

# Finance Reports

Fee Collection

Due List

Salary Report

Income Report

Expense Report

Cash Flow

Transaction History

---

# Library Reports

Issued Books

Returned Books

Overdue Books

Fine Collection

Book Inventory

---

# Transport Reports

Vehicle Usage

Route Summary

Student Transport List

Transport Fee Collection

---

# Hostel Reports

Hostel Occupancy

Bed Availability

Hostel Fee Collection

Visitor Log

---

# Export Formats

PDF

Excel

CSV

Print

---

# Report Workflow

Select Report

↓

Apply Filters

↓

Generate

↓

Preview

↓

Export

↓

Download

---

# APIs

POST /api/v1/reports/generate

POST /api/v1/reports/export

GET /api/v1/reports/templates

GET /api/v1/reports/history

GET /api/v1/reports/download/:id

POST /api/v1/reports/schedule

GET /api/v1/reports/schedule

PATCH /api/v1/reports/schedule/:id

DELETE /api/v1/reports/schedule/:id

---

# Validation Rules

Report Template must exist.

Export Format must be supported.

Only authorized users can generate reports.

Expired exports cannot be downloaded.

---

# Business Rules

Reports must always use historical data.

Generated reports must not modify source data.

Sensitive reports must respect RBAC permissions.

Downloaded reports may have expiration dates.

---

# Future Scope

Support

Interactive Dashboard

Charts & Graphs

Real-time Analytics

Email Scheduled Reports

Cloud Storage

Data Warehouse

Business Intelligence

AI Insights

without redesign.

---

Status

Draft