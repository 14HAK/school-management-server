# Backend Folder Structure

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-21

Depends On

- 00-project-overview.md
- 01-business-rules.md
- 02-database-design.md

---

# Purpose

This document defines the backend folder architecture.

Every developer must follow this structure.

No module should create its own custom folder structure.

---

# Root Structure

backend/

├── src/
├── docs/
├── tests/
├── uploads/
├── public/
├── scripts/
├── logs/
├── package.json
├── .env
├── .env.example
├── .gitignore
├── README.md

---

# src

src/

├── app.js
├── server.js

├── config/

├── routes/

├── modules/

├── middlewares/

├── services/

├── utils/

├── helpers/

├── constants/

├── validators/

├── database/

├── jobs/

├── sockets/

├── storage/

├── emails/

├── templates/

├── types/

└── shared/

---

# Module Structure

modules/

auth/

user/

student/

teacher/

staff/

guardian/

campus/

building/

floor/

room/

academic/

subject/

routine/

attendance/

exam/

finance/

library/

transport/

hostel/

notification/

report/

setting/

---

# Every Module Structure

student/

student.model.js

student.controller.js

student.service.js

student.repository.js

student.routes.js

student.validation.js

student.middleware.js

student.constants.js

student.utils.js

student.docs.md

---

# Config

config/

database.js

server.js

jwt.js

cookie.js

cors.js

cloudinary.js

redis.js

mail.js

logger.js

security.js

---

# Database

database/

connection.js

seed/

migration/

indexes/

transactions/

---

# Middleware

middlewares/

auth.middleware.js

role.middleware.js

permission.middleware.js

validate.middleware.js

error.middleware.js

notFound.middleware.js

upload.middleware.js

rateLimit.middleware.js

audit.middleware.js

---

# Shared

shared/

ApiError.js

ApiResponse.js

asyncHandler.js

pagination.js

queryBuilder.js

logger.js

---

# Utilities

utils/

generateStudentId.js

generateTeacherId.js

generateInvoiceNumber.js

generateRoutine.js

generateOTP.js

generateToken.js

date.js

time.js

file.js

math.js

---

# Validators

validators/

auth/

student/

teacher/

finance/

attendance/

routine/

---

# Services

services/

mail/

sms/

storage/

payment/

notification/

---

# Jobs

jobs/

dailyAttendance.job.js

invoiceReminder.job.js

backup.job.js

cleanup.job.js

examPublish.job.js

promotion.job.js

---

# Email Templates

emails/

verify-email.html

forgot-password.html

invoice.html

salary.html

result.html

---

# Storage

storage/

local/

cloudinary/

exports/

imports/

---

# Socket Events

sockets/

attendance.socket.js

notification.socket.js

chat.socket.js

---

# Logs

logs/

error.log

combined.log

audit.log

---

# Naming Convention

Folders

kebab-case

Files

feature.type.js

Example

student.controller.js

student.service.js

teacher.model.js

---

# Import Rules

Always use absolute imports.

Avoid circular dependency.

Business logic must stay inside service layer.

Controllers must stay thin.

---

# Responsibilities

Controller

↓

Service

↓

Repository

↓

Model

Database

---

# Forbidden

Business logic inside Controller

Database query inside Route

Validation inside Controller

Huge Utility files

Circular imports

---

# Future Ready

This architecture supports

Microservices

Queue System

Redis

GraphQL

gRPC

Multi Database

Docker

Kubernetes

without major restructuring.

---

Status

Draft