# Role-Based Access Control (RBAC)

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-21

Depends On

- 00-project-overview.md
- 01-business-rules.md
- 02-database-design.md
- 03-folder-structure.md
- 04-authentication.md

---

# Purpose

This document defines the authorization system of the School ERP.

Authentication verifies who the user is.

Authorization determines what the user is allowed to do.

Every protected API must verify both authentication and authorization.

---

# RBAC Overview

RBAC = Role Based Access Control

Permission Flow

User

↓

Role

↓

Permission

↓

API Access

---

# Core Collections

users

roles

permissions

---

# Default Roles

SUPER_ADMIN

ADMIN

PRINCIPAL

VICE_PRINCIPAL

ACCOUNTANT

TEACHER

STAFF

LIBRARIAN

STUDENT

GUARDIAN

---

# Permission Format

Each permission follows this format:

resource:action

Examples

student:create

student:read

student:update

student:delete

teacher:create

teacher:update

finance:payment

attendance:create

routine:update

report:view

---

# CRUD Actions

create

read

update

delete

list

export

import

approve

publish

assign

---

# Resource Examples

student

teacher

staff

guardian

user

role

permission

building

room

subject

routine

attendance

exam

result

finance

library

transport

hostel

notification

settings

report

---

# Role Responsibilities

## SUPER_ADMIN

Full access to every module.

Can manage:

- System Settings
- Roles
- Permissions
- Users
- Database Seed
- Security
- All Reports

---

## ADMIN

Can manage daily school operations.

Cannot modify system security.

---

## PRINCIPAL

Can manage:

Academic

Teacher

Routine

Attendance

Exam

Reports

Cannot manage system configuration.

---

## TEACHER

Can:

View Assigned Classes

Take Attendance

Enter Marks

View Routine

View Assigned Students

Cannot manage finance or users.

---

## STUDENT

Can:

Login

View Profile

View Routine

View Attendance

View Result

View Fees

Update Limited Profile Information

Cannot modify academic records.

---

## GUARDIAN

Can:

View Own Child

View Attendance

View Result

View Fee Status

Receive Notifications

Cannot edit school records.

---

# Permission Rules

1. Every user must have at least one role.

2. A user may have multiple roles.

3. Permissions are granted through roles.

4. Permissions are never assigned directly to users.

5. If multiple roles exist, permissions are combined.

---

# Authorization Flow

Request

↓

Authentication

↓

Load User

↓

Load Roles

↓

Load Permissions

↓

Permission Check

↓

Controller

---

# Middleware

Every protected API uses:

authenticate()

authorize()

---

# API Permission Examples

POST /students

Permission:

student:create

---

GET /students

Permission:

student:read

---

PATCH /students/:id

Permission:

student:update

---

DELETE /students/:id

Permission:

student:delete

---

POST /attendance

Permission:

attendance:create

---

POST /finance/payments

Permission:

finance:create

---

# Permission Naming Rules

Always use lowercase.

Always use singular resource name.

Format:

resource:action

Example:

student:update

Correct

teacher:create

Correct

students:create

Wrong

Teacher:Create

Wrong

---

# Security Rules

Unauthorized requests return:

401 Unauthorized

Authenticated but insufficient permission:

403 Forbidden

---

# Future Scope

The RBAC system must support:

Custom Roles

Dynamic Permissions

Module-based Permissions

Branch-specific Permissions

Time-based Permissions

without redesign.

---

Status

Draft