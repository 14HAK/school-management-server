# Validation Standards

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

All Backend Modules

---

# Purpose

This document defines the validation rules used throughout the School ERP backend.

Every incoming request must be validated before any business logic or database operation.

---

# Validation Layers

Request Validation

↓

Business Validation

↓

Database Validation

---

# Required Field Validation

Fields marked as required must not be:

- null
- undefined
- empty string

---

# String Validation

Trim whitespace.

Reject empty strings.

Respect minimum and maximum lengths.

---

# Email Validation

Requirements

Must be a valid email format.

Must be unique where required.

Examples

Valid

admin@example.com

teacher@school.edu

Invalid

admin@

abc

@email.com

---

# Password Validation

Minimum Length

8 Characters

Recommended

12+ Characters

Must contain

Uppercase Letter

Lowercase Letter

Number

Special Character

Passwords must never be stored in plain text.

Passwords must always be hashed.

---

# Phone Number Validation

Must contain digits only.

Country format should be configurable.

Duplicate phone numbers should be prevented where required.

---

# ObjectId Validation

Every referenced ObjectId must:

Exist

Be valid

Reference the correct collection

---

# Date Validation

Use ISO 8601 format.

Dates must be logically valid.

Examples

Admission Date cannot be before Birth Date.

Checkout Date cannot be before Check-in Date.

Exam End Date cannot be before Exam Start Date.

---

# Number Validation

Numbers must respect:

Minimum Value

Maximum Value

Decimal Precision (if applicable)

Examples

Marks

Age

Salary

Fee Amount

Fine Amount

---

# Enum Validation

Only predefined values are allowed.

Examples

Status

Role

Gender

Blood Group

Attendance Status

Exam Status

---

# File Validation

Allowed Types

Image

PDF

ZIP

Excel

Word

Maximum File Size

(Configurable)

Reject unsupported file formats.

---

# URL Validation

Must be a valid URL.

HTTPS is recommended.

---

# Business Validation

Examples

Student must have ACTIVE Enrollment.

Teacher must be assigned before Routine generation.

Book must be AVAILABLE before Issue.

Room Capacity must not be exceeded.

Fee Amount must not become negative.

---

# Duplicate Validation

Prevent duplicate records where required.

Examples

Email

Username

Student ID

Employee ID

Roll Number

Receipt Number

Invoice Number

Vehicle Number

ISBN

Barcode

---

# Cross Module Validation

Attendance

Requires Enrollment

Routine

Requires Teacher Assignment

Result

Requires Exam Completion

Library

Requires Active Library Card

Finance

Requires Active Student Enrollment

---

# Validation Response

Example

{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists."
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter."
    }
  ]
}

---

# Recommended Libraries

Zod

or

Joi

or

Express Validator

Only one validation strategy should be used consistently across the project.

---

# Business Rules

Validation must occur before database operations.

Validation errors must return meaningful messages.

Internal database errors must never be exposed to clients.

---

# Future Scope

Support

Custom Validation Rules

Multi-language Validation Messages

Schema Versioning

Dynamic Validation Rules

without redesign.

---

Status

Draft