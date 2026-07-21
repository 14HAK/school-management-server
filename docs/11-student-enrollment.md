# Student Enrollment

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 06-user-management.md
- 08-academic.md
- 09-subject.md
- 10-teacher-assignment.md

---

# Purpose

This document defines the complete student enrollment process.

Enrollment determines where a student studies during a specific academic year.

Student profile and enrollment are managed separately.

---

# Collection

studentEnrollments

---

# Enrollment Fields

_id

studentId

academicYearId

classId

sectionId

groupId

rollNumber

status

admissionDate

remarks

createdAt

updatedAt

---

# Relationship

Student

↓

Student Enrollment

↓

Academic Year

↓

Class

↓

Section

↓

Group

---

# Enrollment Rules

One Enrollment belongs to one Student.

One Enrollment belongs to one Academic Year.

One Enrollment belongs to one Class.

One Enrollment belongs to one Section.

One Enrollment may belong to one Group.

---

# Admission Flow

Student Registration

↓

Student Profile

↓

Enrollment

↓

Roll Number

↓

Subjects

↓

Routine

↓

Attendance

↓

Completed

---

# Roll Number Rules

Roll Number is unique within

Academic Year

+

Class

+

Section

Example

2026

↓

Class 7

↓

Section A

↓

Roll 01

---

# Group Rules

Applicable only for

Class 9

Class 10

SSC

Supported Groups

Science

Commerce

Humanities

---

# Enrollment Status

PENDING

ACTIVE

PROMOTED

TRANSFERRED

COMPLETED

DROPPED

---

# Promotion

Promotion creates a new Enrollment.

Previous Enrollment remains unchanged.

Example

2026

↓

Class 6

↓

Completed

↓

2027

↓

Class 7

↓

New Enrollment

---

# Student Transfer

Transfer keeps previous enrollment history.

New enrollment is created for the destination class.

---

# Enrollment Validation

Student is required.

Academic Year is required.

Class is required.

Section is required.

Roll Number is required.

Duplicate Enrollment is not allowed.

A student cannot have two ACTIVE enrollments in the same Academic Year.

---

# APIs

POST /api/v1/student-enrollments

GET /api/v1/student-enrollments

GET /api/v1/student-enrollments/:id

PATCH /api/v1/student-enrollments/:id

DELETE /api/v1/student-enrollments/:id

POST /api/v1/student-enrollments/promote

POST /api/v1/student-enrollments/transfer

GET /api/v1/student-enrollments/student/:studentId

---

# Business Rules

Enrollment must exist before:

- Class Routine
- Attendance
- Examination
- Result
- Student Fees

A deleted enrollment must never remove academic history.

Historical records are read-only.

---

# Future Scope

Support

Online Admission

Admission Test

Waiting List

Seat Reservation

Bulk Enrollment

Student Migration

without redesign.

---

Status

Draft