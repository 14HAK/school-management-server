# Teacher Assignment

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 06-user-management.md
- 08-academic.md
- 09-subject.md

---

# Purpose

This document defines how teachers are assigned to academic activities.

A teacher may teach multiple subjects, multiple classes and multiple sections.

The assignment module is used by:

- Class Routine
- Attendance
- Examination
- Result Processing

---

# Collection

teacherAssignments

---

# Assignment Fields

_id

teacherId

academicYearId

classId

sectionId

groupId

subjectId

isClassTeacher

status

remarks

createdAt

updatedAt

---

# Relationships

Teacher

↓

Teacher Assignment

↓

Academic Year

↓

Class

↓

Section

↓

Group

↓

Subject

---

# Assignment Rules

One Assignment belongs to one Teacher.

One Assignment belongs to one Subject.

One Assignment belongs to one Class.

One Assignment belongs to one Section.

Group is required only for Class 9, Class 10 and SSC.

---

# Class Teacher

Each section can have only one Class Teacher.

Example

Class 6

↓

Section A

↓

Teacher A

---

Class 6

↓

Section B

↓

Teacher B

---

# Subject Teacher

A Subject Teacher teaches one subject in one class and section.

Example

Teacher

↓

Mathematics

↓

Class 8

↓

Section A

---

# Multiple Assignments

A teacher may have multiple assignments.

Example

Teacher A

↓

Class 6 English

↓

Class 7 English

↓

Class 8 English

↓

Class 9 English

---

# Workload

Teacher workload is calculated from assignments.

Future versions may calculate:

- Total Classes
- Weekly Periods
- Daily Periods

---

# Assignment Status

ACTIVE

INACTIVE

ARCHIVED

---

# Assignment Rules

Duplicate assignments are not allowed.

Example

Teacher A

↓

Class 7

↓

Section A

↓

English

Cannot exist twice.

---

# APIs

POST /api/v1/teacher-assignments

GET /api/v1/teacher-assignments

GET /api/v1/teacher-assignments/:id

PATCH /api/v1/teacher-assignments/:id

DELETE /api/v1/teacher-assignments/:id

GET /api/v1/teacher-assignments/teacher/:teacherId

GET /api/v1/teacher-assignments/class/:classId

GET /api/v1/teacher-assignments/subject/:subjectId

---

# Validation Rules

Teacher is required.

Academic Year is required.

Class is required.

Section is required.

Subject is required.

Group is required only for Class 9–SSC.

Duplicate assignment is not allowed.

---

# Business Rules

A Teacher cannot be assigned to two classes during the same routine period.

A Subject must have at least one assigned Teacher before routine generation.

A Teacher can be both Class Teacher and Subject Teacher.

---

# Future Scope

Support

Temporary Teacher Assignment

Substitute Teacher

Guest Teacher

Team Teaching

Automatic Workload Distribution

without redesign.

---

Status

Draft