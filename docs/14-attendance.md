# Attendance Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 06-user-management.md
- 08-academic.md
- 10-teacher-assignment.md
- 11-student-enrollment.md
- 12-class-routine-engine.md

---

# Purpose

This document defines the attendance management system for Students, Teachers and Staff.

The attendance module supports daily attendance while allowing future expansion for period-wise attendance and biometric integration.

---

# Core Collections

studentAttendances

teacherAttendances

staffAttendances

attendanceSummaries

---

# Student Attendance Fields

_id

studentId

academicYearId

classId

sectionId

groupId

date

attendanceStatus

checkInTime

checkOutTime

markedBy

remarks

createdAt

updatedAt

---

# Teacher Attendance Fields

_id

teacherId

date

attendanceStatus

checkInTime

checkOutTime

remarks

createdAt

updatedAt

---

# Staff Attendance Fields

_id

staffId

date

attendanceStatus

checkInTime

checkOutTime

remarks

createdAt

updatedAt

---

# Attendance Status

PRESENT

ABSENT

LATE

LEAVE

HOLIDAY

HALF_DAY

---

# Attendance Workflow

Open Attendance

↓

Select Class

↓

Select Section

↓

Mark Attendance

↓

Save

↓

Generate Daily Summary

---

# Student Attendance Rules

One student can have only one attendance record per day.

Attendance requires an active enrollment.

Attendance cannot be marked for archived students.

---

# Teacher Attendance Rules

One teacher can have only one attendance record per day.

Teacher attendance is independent from class routine.

---

# Staff Attendance Rules

One staff member can have only one attendance record per day.

---

# Attendance Summary

The system should generate:

Daily Attendance

Monthly Attendance

Yearly Attendance

Student Attendance Percentage

Teacher Attendance Percentage

Staff Attendance Percentage

---

# Leave Rules

Leave requests may be approved before attendance is finalized.

Approved leave automatically marks attendance as LEAVE.

---

# Attendance Status Flow

Draft

↓

Submitted

↓

Verified

↓

Locked

---

# APIs

POST /api/v1/student-attendances

GET /api/v1/student-attendances

GET /api/v1/student-attendances/:id

PATCH /api/v1/student-attendances/:id

DELETE /api/v1/student-attendances/:id

---

POST /api/v1/teacher-attendances

GET /api/v1/teacher-attendances

PATCH /api/v1/teacher-attendances/:id

---

POST /api/v1/staff-attendances

GET /api/v1/staff-attendances

PATCH /api/v1/staff-attendances/:id

---

GET /api/v1/attendance-summary

GET /api/v1/attendance-summary/student/:studentId

GET /api/v1/attendance-summary/teacher/:teacherId

GET /api/v1/attendance-summary/staff/:staffId

---

# Validation Rules

Student, Teacher or Staff reference is required.

Attendance Date is required.

Attendance Status is required.

Duplicate attendance for the same person on the same date is not allowed.

Check-out time cannot be earlier than Check-in time.

---

# Business Rules

Attendance cannot be modified after it is LOCKED.

Attendance history must never be deleted.

Attendance reports must always use historical records.

Routine changes must not affect historical attendance.

---

# Future Scope

Support

Period-wise Attendance

QR Code Attendance

RFID Attendance

Fingerprint Device Integration

Face Recognition

GPS Attendance

Mobile Attendance App

Offline Attendance Sync

without redesign.

---

Status

Draft