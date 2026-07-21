# Class Routine Engine

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 08-academic.md
- 09-subject.md
- 10-teacher-assignment.md
- 11-student-enrollment.md
- 07-campus-building-room.md

---

# Purpose

This document defines the class routine generation system.

The routine engine assigns subjects, teachers and classrooms into available periods while preventing scheduling conflicts.

---

# Collection

classRoutines

---

# Routine Fields

_id

academicYearId

classId

sectionId

groupId

day

period

subjectId

teacherId

roomId

startTime

endTime

status

createdAt

updatedAt

---

# Routine Structure

Academic Year

↓

Class

↓

Section

↓

Group

↓

Day

↓

Period

↓

Subject

↓

Teacher

↓

Room

---

# Working Days

Saturday

Sunday

Monday

Tuesday

Wednesday

Thursday

Friday (Optional)

Working days can be configured from system settings.

---

# Period Configuration

Every period contains

Period Number

Start Time

End Time

Duration

Break Indicator

Example

Period 1

08:00 AM

08:45 AM

---

Period 2

08:45 AM

09:30 AM

---

Break

09:30 AM

09:45 AM

---

Period 3

09:45 AM

10:30 AM

---

The number of periods is configurable.

---

# Routine Rules

One class can have only one subject in the same period.

One teacher cannot teach two classes in the same period.

One room cannot be assigned to multiple classes in the same period.

Only assigned teachers can teach assigned subjects.

Only classrooms can be assigned for classroom periods.

---

# Conflict Detection

The system must detect:

Teacher Conflict

Room Conflict

Duplicate Subject Period

Duplicate Class Period

Invalid Assignment

The routine cannot be published until all conflicts are resolved.

---

# Routine Status

DRAFT

ACTIVE

LOCKED

ARCHIVED

---

# Routine Generation

The system supports

Manual Routine

Automatic Routine

Mixed Mode

---

# Auto Routine Rules

The engine should consider

Teacher Availability

Subject Assignment

Room Availability

Working Days

Period Limits

Section

Group

---

# Routine Lock

Once a routine is LOCKED

No modification is allowed

unless unlocked by an authorized user.

---

# APIs

POST /api/v1/class-routines

GET /api/v1/class-routines

GET /api/v1/class-routines/:id

PATCH /api/v1/class-routines/:id

DELETE /api/v1/class-routines/:id

POST /api/v1/class-routines/generate

POST /api/v1/class-routines/publish

POST /api/v1/class-routines/lock

POST /api/v1/class-routines/unlock

GET /api/v1/class-routines/class/:classId

GET /api/v1/class-routines/teacher/:teacherId

GET /api/v1/class-routines/room/:roomId

---

# Validation Rules

Academic Year is required.

Class is required.

Section is required.

Day is required.

Period is required.

Subject is required.

Teacher is required.

Room is required.

Start Time must be before End Time.

Duplicate class routine is not allowed.

Duplicate teacher routine is not allowed.

Duplicate room routine is not allowed.

---

# Business Rules

Routine must exist before Attendance.

Routine must exist before Teacher Daily Schedule.

Routine changes do not affect historical attendance.

Routine history should be preserved after updates.

---

# Future Scope

Support

Teacher Leave Adjustment

Temporary Teacher Replacement

Holiday Adjustment

Exam Routine Integration

AI Based Routine Generator

without redesign.

---

Status

Draft