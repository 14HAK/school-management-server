# Academic Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 00-project-overview.md
- 01-business-rules.md
- 02-database-design.md
- 03-folder-structure.md
- 06-user-management.md
- 07-campus-building-room.md

---

# Purpose

This document defines the academic structure of the School ERP.

All academic modules such as Student Enrollment, Subject, Teacher Assignment, Routine, Attendance and Examination depend on this module.

---

# Academic Structure

The academic system is organized as:

Academic Year

↓

Class

↓

Section

↓

Group

↓

Student

---

# Academic Year

Purpose

Represents a complete academic year.

Examples

2026

2027

2028

Only one Academic Year can remain ACTIVE at a time.

---

# Class Levels

Supported Classes

Class 0

Class 1

Class 2

Class 3

Class 4

Class 5

Class 6

Class 7

Class 8

Class 9

Class 10

SSC

---

# Sections

Class 0 – Class 8

Section A

Section B

---

Class 9

Section A

Section B

Section C

---

Class 10

Section A

Section B

Section C

---

SSC

Section A

Section B

Section C

---

# Groups

Applicable For

Class 9

Class 10

SSC

Supported Groups

Science

Commerce

Humanities

Classes below Class 9 do not use Groups.

---

# Academic Status

ACTIVE

INACTIVE

COMPLETED

ARCHIVED

---

# Class Capacity

Each class section has a maximum student capacity.

Capacity must be checked before new enrollment.

---

# Academic Rules

1. Every Student must belong to one Academic Year.

2. Every Student must belong to one Class.

3. Every Student must belong to one Section.

4. Group is required only for Class 9, Class 10 and SSC.

5. One Section can contain multiple Students.

6. A Student cannot belong to multiple Sections in the same Academic Year.

---

# Promotion Rules

Promotion occurs after final examination.

Example

Class 5

↓

Class 6

Previous academic history must be preserved.

---

# Academic Collections

academicYears

classes

sections

groups

---

# APIs

POST /api/v1/academic-years

GET /api/v1/academic-years

PATCH /api/v1/academic-years/:id

DELETE /api/v1/academic-years/:id

---

GET /api/v1/classes

GET /api/v1/sections

GET /api/v1/groups

---

# Validation Rules

Academic Year must be unique.

Only one Academic Year can be ACTIVE.

Class name cannot be duplicated.

Section name cannot be empty.

Group is mandatory for Class 9–SSC.

---

# Future Scope

The academic module should support:

Multiple Academic Calendars

Semester System

Shift-based Classes

Multi-Campus Academic Structure

without major redesign.

---

Status

Draft