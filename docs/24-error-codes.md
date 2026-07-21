# Error Codes

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

All Backend Modules

---

# Purpose

This document defines the standard error codes used throughout the School ERP backend.

Every API must return a consistent error structure.

---

# Error Response Structure

Example

{
    "success": false,
    "statusCode": 400,
    "errorCode": "VALIDATION_001",
    "message": "Validation failed.",
    "errors": [
        {
            "field": "email",
            "message": "Email already exists."
        }
    ],
    "timestamp": "2026-07-22T12:00:00Z",
    "path": "/api/v1/users"
}

---

# HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

429 Too Many Requests

500 Internal Server Error

503 Service Unavailable

---

# Validation Errors

VALIDATION_001

Required Field Missing

HTTP 400

---

VALIDATION_002

Invalid Email Format

HTTP 400

---

VALIDATION_003

Invalid Phone Number

HTTP 400

---

VALIDATION_004

Password Policy Failed

HTTP 400

---

VALIDATION_005

Invalid ObjectId

HTTP 400

---

VALIDATION_006

Duplicate Record

HTTP 409

---

# Authentication Errors

AUTH_001

Invalid Credentials

HTTP 401

---

AUTH_002

Access Token Missing

HTTP 401

---

AUTH_003

Invalid Access Token

HTTP 401

---

AUTH_004

Refresh Token Expired

HTTP 401

---

AUTH_005

Account Disabled

HTTP 403

---

AUTH_006

Email Not Verified

HTTP 403

---

# Authorization Errors

RBAC_001

Permission Denied

HTTP 403

---

RBAC_002

Role Not Allowed

HTTP 403

---

RBAC_003

Resource Access Denied

HTTP 403

---

# Student Errors

STUDENT_001

Student Not Found

HTTP 404

---

STUDENT_002

Enrollment Required

HTTP 400

---

STUDENT_003

Duplicate Roll Number

HTTP 409

---

# Teacher Errors

TEACHER_001

Teacher Not Found

HTTP 404

---

TEACHER_002

Teacher Assignment Missing

HTTP 400

---

TEACHER_003

Teacher Schedule Conflict

HTTP 409

---

# Routine Errors

ROUTINE_001

Room Conflict

HTTP 409

---

ROUTINE_002

Teacher Conflict

HTTP 409

---

ROUTINE_003

Routine Already Locked

HTTP 409

---

# Exam Errors

EXAM_001

Exam Not Found

HTTP 404

---

EXAM_002

Marks Exceed Full Marks

HTTP 400

---

EXAM_003

Result Already Published

HTTP 409

---

# Attendance Errors

ATTENDANCE_001

Attendance Already Exists

HTTP 409

---

ATTENDANCE_002

Attendance Locked

HTTP 409

---

# Finance Errors

FINANCE_001

Fee Structure Missing

HTTP 400

---

FINANCE_002

Payment Amount Invalid

HTTP 400

---

FINANCE_003

Receipt Already Exists

HTTP 409

---

# Library Errors

LIBRARY_001

Book Not Available

HTTP 409

---

LIBRARY_002

Borrow Limit Exceeded

HTTP 409

---

LIBRARY_003

Library Card Expired

HTTP 400

---

# Transport Errors

TRANSPORT_001

Vehicle Full

HTTP 409

---

TRANSPORT_002

Driver Not Available

HTTP 409

---

# Hostel Errors

HOSTEL_001

No Bed Available

HTTP 409

---

HOSTEL_002

Student Already Allocated

HTTP 409

---

# System Errors

SYSTEM_001

Unexpected Error

HTTP 500

---

SYSTEM_002

Database Connection Failed

HTTP 503

---

SYSTEM_003

File Upload Failed

HTTP 500

---

SYSTEM_004

Service Temporarily Unavailable

HTTP 503

---

# Logging Rules

All 5xx errors must be logged.

Authentication failures should be logged.

Permission denials should be logged.

Sensitive information must never appear in API responses.

---

# Business Rules

Every custom error must have:

Unique Error Code

HTTP Status Code

Readable Message

Optional Error Details

---

# Future Scope

Support

Localization

Error Documentation Portal

Client-side Error Mapping

without redesign.

---

Status

Draft