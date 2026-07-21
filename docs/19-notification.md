# Notification Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 06-user-management.md
- 08-academic.md
- 13-exam-engine.md
- 14-attendance.md
- 15-finance.md

---

# Purpose

This document defines the notification system used throughout the School ERP.

The notification module delivers important information to students, teachers, staff, guardians and administrators.

---

# Core Collections

notifications

notificationTemplates

notificationLogs

announcementBoards

---

# Notification

Collection

notifications

Fields

_id

title

message

type

priority

senderId

receiverIds

channel

status

scheduledAt

sentAt

readAt

createdAt

updatedAt

---

# Notification Template

Collection

notificationTemplates

Fields

_id

name

type

subject

content

variables

status

createdAt

updatedAt

---

# Notification Log

Collection

notificationLogs

Fields

_id

notificationId

receiverId

channel

deliveryStatus

deliveryTime

errorMessage

createdAt

---

# Announcement

Collection

announcementBoards

Fields

_id

title

description

targetAudience

publishDate

expireDate

createdBy

status

createdAt

updatedAt

---

# Notification Types

GENERAL

ATTENDANCE

EXAM

RESULT

FEE

LIBRARY

TRANSPORT

HOSTEL

EMERGENCY

SYSTEM

CUSTOM

---

# Notification Channels

IN_APP

EMAIL

SMS

PUSH

---

# Priority Levels

LOW

NORMAL

HIGH

URGENT

---

# Notification Status

DRAFT

SCHEDULED

SENT

DELIVERED

READ

FAILED

CANCELLED

---

# Announcement Status

DRAFT

PUBLISHED

ARCHIVED

---

# Notification Workflow

Create Notification

↓

Select Template (Optional)

↓

Select Audience

↓

Select Channel

↓

Send

↓

Delivery Log

↓

Read Status

---

# Target Audience

Students

Teachers

Staff

Guardians

Administrators

Custom Users

---

# Business Rules

One Notification may have multiple Receivers.

Notifications must keep delivery history.

Deleting a User must not remove notification history.

Announcements remain visible until Expire Date.

---

# Automatic Notifications

The system should automatically send notifications for:

Student Admission

Fee Due

Fee Payment

Exam Schedule

Exam Result

Attendance Alert

Book Due Reminder

Transport Update

Hostel Allocation

Password Reset

Account Verification

---

# APIs

POST /api/v1/notifications

GET /api/v1/notifications

GET /api/v1/notifications/:id

PATCH /api/v1/notifications/:id

DELETE /api/v1/notifications/:id

---

POST /api/v1/notification-templates

GET /api/v1/notification-templates

PATCH /api/v1/notification-templates/:id

---

POST /api/v1/announcements

GET /api/v1/announcements

PATCH /api/v1/announcements/:id

DELETE /api/v1/announcements/:id

---

GET /api/v1/notification-logs

GET /api/v1/notifications/user/:userId

POST /api/v1/notifications/:id/read

---

# Validation Rules

Notification Title is required.

Notification Message is required.

At least one Receiver is required.

At least one Channel is required.

Scheduled Time cannot be earlier than current time.

Expire Date must be later than Publish Date.

---

# Future Scope

Support

WhatsApp Notifications

Telegram Notifications

Firebase Push Notifications

Web Push Notifications

Voice Call Alerts

Parent Mobile App Notifications

AI Generated Messages

Multi-language Templates

without redesign.

---

Status

Draft