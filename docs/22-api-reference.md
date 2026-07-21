# API Reference

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

All Backend Modules

---

# Purpose

This document defines the API standards used throughout the School ERP backend.

Every REST API must follow these conventions.

---

# Base URL

Development

/api/v1

Production

/api/v1

---

# Authentication

Authorization

Bearer <ACCESS_TOKEN>

Example

Authorization: Bearer eyJhb...

---

# Content Type

application/json

For file upload

multipart/form-data

---

# HTTP Methods

GET

Read Resources

POST

Create Resources

PUT

Replace Resources

PATCH

Update Resources

DELETE

Delete Resources

---

# Success Response

Status Code

200 OK

Example

{
    "success": true,
    "message": "Request successful.",
    "data": {}
}

---

# Create Response

Status Code

201 Created

Example

{
    "success": true,
    "message": "Resource created successfully.",
    "data": {}
}

---

# Error Response

Status Code

400

401

403

404

409

422

500

Example

{
    "success": false,
    "message": "Validation failed.",
    "errors": [
        {
            "field": "email",
            "message": "Email already exists."
        }
    ]
}

---

# Pagination

Query Parameters

?page=1

?limit=20

Example

GET

/api/v1/students?page=1&limit=20

Response

{
    "success": true,
    "data": [],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 540,
        "pages": 27
    }
}

---

# Searching

Example

GET

/api/v1/students?search=Rahim

---

# Filtering

Examples

?status=ACTIVE

?class=7

?section=A

?group=Science

?academicYear=2026

Multiple filters may be combined.

---

# Sorting

Ascending

?sort=name

Descending

?sort=-createdAt

Multiple sorting

?sort=class,name

---

# Field Selection

Example

GET

/api/v1/students?fields=name,email,phone

---

# Soft Delete

Resources should not be permanently deleted unless explicitly required.

Recommended field

deletedAt

deletedBy

---

# File Upload

Endpoint Example

POST

/api/v1/uploads

Supported Types

Image

PDF

ZIP

Document

Maximum File Size

(Configurable)

---

# Date Format

ISO 8601

Example

2026-07-22T08:30:00Z

---

# Time Zone

Use UTC in Database.

Convert to local timezone in frontend.

---

# API Versioning

Current

/api/v1

Future

/api/v2

Breaking changes require a new API version.

---

# Idempotency

GET

Safe

PUT

Idempotent

PATCH

Partial Update

POST

Not Idempotent

DELETE

Idempotent

---

# Rate Limiting

Recommended

100 Requests / Minute

(Configurable)

---

# Authentication Rules

Public Endpoints

Login

Register

Refresh Token

Forgot Password

Reset Password

Health Check

All other endpoints require authentication unless explicitly documented.

---

# Naming Convention

Collections

Plural

students

teachers

subjects

Routes

kebab-case

student-enrollments

teacher-assignments

---

# API Documentation

Swagger / OpenAPI

should be generated automatically.

---

# Business Rules

Every API should return consistent response structures.

Every API should validate input before database operations.

Every protected API must verify authentication and authorization.

---

# Future Scope

Support

GraphQL

gRPC

Webhook Events

Public APIs

API Keys

Developer Portal

OpenAPI Client Generation

without redesign.

---

Status

Draft