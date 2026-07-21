# Settings Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

All Modules

---

# Purpose

This document defines the centralized configuration system for the School ERP.

The settings module stores configurable values used across the entire application.

Business rules should be configurable whenever possible instead of being hardcoded.

---

# Core Collections

systemSettings

academicSettings

attendanceSettings

routineSettings

examSettings

financeSettings

notificationSettings

librarySettings

transportSettings

hostelSettings

---

# System Settings

Collection

systemSettings

Fields

_id

schoolName

schoolCode

schoolEmail

schoolPhone

website

timezone

currency

language

logo

favicon

address

status

createdAt

updatedAt

---

# Academic Settings

Fields

academicYear

workingDays

classStartTime

classEndTime

maximumPeriodsPerDay

defaultSectionCount

defaultGroupSystem

promotionPolicy

status

---

# Attendance Settings

Fields

attendanceOpenTime

attendanceCloseTime

lateAfterMinutes

allowManualCorrection

allowTeacherSelfAttendance

status

---

# Routine Settings

Fields

defaultPeriodDuration

breakDuration

maximumPeriodsPerTeacher

allowAutoRoutine

allowManualOverride

status

---

# Exam Settings

Fields

defaultPassingMarks

defaultFullMarks

gradingSystem

gpaSystem

allowResultEdit

status

---

# Finance Settings

Fields

defaultCurrency

lateFeeEnabled

lateFeeAmount

allowInstallment

receiptPrefix

invoicePrefix

status

---

# Notification Settings

Fields

emailEnabled

smsEnabled

pushEnabled

defaultSenderName

retryLimit

status

---

# Library Settings

Fields

maximumBooksStudent

maximumBooksTeacher

maximumBooksStaff

defaultBorrowDays

dailyFineAmount

status

---

# Transport Settings

Fields

maximumVehicleCapacity

gpsEnabled

transportFeeMode

allowMultipleRoutes

status

---

# Hostel Settings

Fields

allowOnlineAllocation

visitorAllowed

visitorStartTime

visitorEndTime

hostelFeeMode

status

---

# Setting Categories

System

Academic

Attendance

Routine

Exam

Finance

Library

Transport

Hostel

Notification

Security

Custom

---

# APIs

GET /api/v1/settings

PATCH /api/v1/settings

---

GET /api/v1/settings/system

PATCH /api/v1/settings/system

---

GET /api/v1/settings/academic

PATCH /api/v1/settings/academic

---

GET /api/v1/settings/attendance

PATCH /api/v1/settings/attendance

---

GET /api/v1/settings/routine

PATCH /api/v1/settings/routine

---

GET /api/v1/settings/exam

PATCH /api/v1/settings/exam

---

GET /api/v1/settings/finance

PATCH /api/v1/settings/finance

---

GET /api/v1/settings/library

PATCH /api/v1/settings/library

---

GET /api/v1/settings/transport

PATCH /api/v1/settings/transport

---

GET /api/v1/settings/hostel

PATCH /api/v1/settings/hostel

---

GET /api/v1/settings/notification

PATCH /api/v1/settings/notification

---

# Validation Rules

School Name is required.

School Code must be unique.

Currency must be supported.

Timezone must be valid.

Maximum Periods must be greater than zero.

Working Days cannot be empty.

Receipt Prefix must be unique.

Invoice Prefix must be unique.

---

# Business Rules

Only SUPER_ADMIN can modify settings.

Settings changes must be logged.

Historical settings should remain available for auditing.

Some settings require system restart or cache refresh.

---

# Future Scope

Support

Multi Campus Settings

Multi Language

Theme Configuration

Feature Toggle

Plugin Configuration

Backup Settings

Third-party Integrations

Environment-based Configuration

without redesign.

---

Status

Draft