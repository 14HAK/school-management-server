# Exam Engine

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 08-academic.md
- 09-subject.md
- 10-teacher-assignment.md
- 11-student-enrollment.md
- 12-class-routine-engine.md

---

# Purpose

This document defines the complete examination management system.

The exam engine manages:

- Exam Creation
- Exam Schedule
- Subject-wise Exams
- Room Allocation
- Invigilator Assignment
- Marks Entry
- Result Processing
- Result Publication

---

# Core Collections

exams

examSchedules

examRooms

examInvigilators

examMarks

examResults

---

# Exam Fields

_id

academicYearId

examName

examType

startDate

endDate

status

createdAt

updatedAt

---

# Supported Exam Types

Class Test

Monthly Test

Model Test

Half Yearly

Annual

Pre-Test

Test Examination

SSC

Custom

---

# Exam Schedule Fields

_id

examId

classId

sectionId

groupId

subjectId

examDate

startTime

endTime

roomId

fullMarks

passMarks

status

---

# Invigilator Fields

_id

examScheduleId

teacherId

role

status

---

# Marks Fields

_id

examScheduleId

studentId

obtainedMarks

remarks

enteredBy

enteredAt

updatedAt

---

# Result Fields

_id

examId

studentId

totalMarks

obtainedMarks

percentage

grade

gpa

position

status

publishedAt

---

# Exam Workflow

Create Exam

↓

Create Schedule

↓

Assign Room

↓

Assign Invigilator

↓

Conduct Exam

↓

Enter Marks

↓

Generate Result

↓

Publish Result

---

# Exam Rules

One subject can have only one exam schedule within the same exam.

One room cannot host multiple exams at the same time.

One teacher cannot invigilate two exam rooms at the same time.

Students must be enrolled before appearing in an exam.

Marks cannot exceed Full Marks.

Pass Marks cannot exceed Full Marks.

---

# Exam Status

DRAFT

SCHEDULED

ONGOING

COMPLETED

PUBLISHED

ARCHIVED

---

# APIs

POST /api/v1/exams

GET /api/v1/exams

GET /api/v1/exams/:id

PATCH /api/v1/exams/:id

DELETE /api/v1/exams/:id

---

POST /api/v1/exam-schedules

GET /api/v1/exam-schedules

PATCH /api/v1/exam-schedules/:id

DELETE /api/v1/exam-schedules/:id

---

POST /api/v1/exam-marks

GET /api/v1/exam-marks

PATCH /api/v1/exam-marks/:id

---

POST /api/v1/exam-results/generate

POST /api/v1/exam-results/publish

GET /api/v1/exam-results/student/:studentId

---

# Validation Rules

Academic Year is required.

Exam Name is required.

Exam Type is required.

Subject is required.

Exam Date is required.

Room is required.

Teacher is required for invigilation.

Marks must be between 0 and Full Marks.

Duplicate exam schedule is not allowed.

---

# Business Rules

Exam Schedule must be finalized before Marks Entry.

Published Results cannot be modified.

Any correction must create a new revision log.

Historical Exam Data must never be deleted.

---

# Future Scope

Support

Practical Exams

Oral Exams

MCQ + CQ Pattern

Digital Admit Card

Seat Plan Generator

Barcode Answer Script

Automatic GPA Calculation

Board Result Integration

without redesign.

---

Status

Draft