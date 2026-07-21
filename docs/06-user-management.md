# User Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-21

Depends On

- 00-project-overview.md
- 01-business-rules.md
- 02-database-design.md
- 03-folder-structure.md
- 04-authentication.md
- 05-rbac.md

---

# Purpose

This document defines how users are created, managed and connected with profiles.

The authentication system only knows the User.

Business information is stored inside profile collections.

---

# User Architecture

User

↓

Student

Teacher

Staff

Guardian

---

# Core Collections

users

students

teachers

staff

guardians

---

# User Collection

Purpose

Store authentication information.

Fields

_id

email

password

roleIds

profileType

profileId

accountStatus

emailVerified

lastLogin

createdAt

updatedAt

---

# Student Collection

Purpose

Store all student information.

Reference

userId

Fields

_id

userId

studentId

personalInfo

contactInfo

guardianInfo

academicInfo

joiningDate

academy

status

createdAt

updatedAt

---

# Teacher Collection

Purpose

Store teacher profile.

Reference

userId

Fields

_id

userId

employeeId

personalInfo

contactInfo

academicInfo

experience

bankInformation

joiningDate

academy

assignedSubjects

status

createdAt

updatedAt

---

# Staff Collection

Purpose

Store staff profile.

Reference

userId

Fields

_id

userId

employeeId

designation

personalInfo

contactInfo

experience

joiningDate

academy

status

createdAt

updatedAt

---

# Guardian Collection

Purpose

Store guardian information.

Reference

userId (Optional)

Fields

_id

fatherName

motherName

phone

email

occupation

address

students

status

---

# Personal Information

nickname

fullName

gender

dateOfBirth

bloodGroup

nationalId

photo

---

# Contact Information

phone

email

division

district

upazila

postalCode

presentAddress

permanentAddress

---

# Academic Information (Teacher)

highestQualification

institution

passingYear

result

registrationNumber

---

# Academic Information (Student)

Current class information is NOT stored here.

Academic history only.

---

# User Creation Flow

Create User

↓

Hash Password

↓

Assign Role

↓

Create Profile

↓

Update User.profileId

↓

Send Verification Email

↓

Completed

---

# Profile Rules

One User

↓

One Profile

User cannot have multiple profile types.

Examples

Correct

User → Teacher

User → Student

Wrong

User → Teacher + Student

---

# Account Status

ACTIVE

INACTIVE

BLOCKED

SUSPENDED

PENDING_VERIFICATION

---

# User Lifecycle

Register

↓

Email Verification

↓

Profile Creation

↓

Approval

↓

Active

↓

Suspended (Optional)

↓

Archived

---

# User APIs

POST /api/v1/users

GET /api/v1/users

GET /api/v1/users/:id

PATCH /api/v1/users/:id

DELETE /api/v1/users/:id

GET /api/v1/users/profile

PATCH /api/v1/users/profile

---

# Student APIs

POST /api/v1/students

GET /api/v1/students

GET /api/v1/students/:id

PATCH /api/v1/students/:id

DELETE /api/v1/students/:id

---

# Teacher APIs

POST /api/v1/teachers

GET /api/v1/teachers

GET /api/v1/teachers/:id

PATCH /api/v1/teachers/:id

DELETE /api/v1/teachers/:id

---

# Staff APIs

POST /api/v1/staff

GET /api/v1/staff

GET /api/v1/staff/:id

PATCH /api/v1/staff/:id

DELETE /api/v1/staff/:id

---

# Guardian APIs

POST /api/v1/guardians

GET /api/v1/guardians

PATCH /api/v1/guardians/:id

GET /api/v1/guardians/:id

---

# Validation Rules

Email must be unique.

Student ID must be unique.

Employee ID must be unique.

Phone number must be valid.

Password is stored only inside User collection.

---

# Future Scope

Support:

Parent Portal

Student Mobile App

Teacher Mobile App

Biometric Profile

Digital Signature

QR Identity Card

without redesign.

---

Status

Draft