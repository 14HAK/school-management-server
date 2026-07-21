# Cron Jobs

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

All Backend Modules

---

# Purpose

This document defines all scheduled background jobs used by the School ERP.

Cron jobs automate repetitive tasks without user interaction.

---

# Job Categories

Academic

Attendance

Finance

Library

Notification

Security

Maintenance

Backup

System

---

# Core Collections

jobLogs

scheduledJobs

---

# Scheduled Job

Collection

scheduledJobs

Fields

_id

jobName

jobType

schedule

enabled

lastRunAt

nextRunAt

status

createdAt

updatedAt

---

# Job Log

Collection

jobLogs

Fields

_id

jobName

startedAt

completedAt

duration

status

message

error

createdAt

---

# Attendance Jobs

Daily Attendance Summary

Generate attendance summary after school hours.

Schedule

Every Day

---

Monthly Attendance Summary

Generate monthly statistics.

Schedule

First day of every month.

---

# Finance Jobs

Fee Due Processing

Mark overdue student fees.

Schedule

Every Day

---

Late Fee Calculation

Automatically calculate fines.

Schedule

Every Night

---

Salary Reminder

Notify finance before salary processing.

Schedule

Monthly

---

# Library Jobs

Overdue Book Detection

Detect overdue books.

Schedule

Every Night

---

Fine Calculation

Calculate overdue fines.

Schedule

Every Night

---

# Notification Jobs

Scheduled Notification Delivery

Send queued notifications.

Schedule

Every Minute

---

Reminder Processing

Exam Reminder

Fee Reminder

Book Return Reminder

Transport Reminder

Schedule

Daily

---

# Academic Jobs

Promotion Preparation

Prepare promotion reports.

Schedule

Year End

---

Result Publication Reminder

Notify administrators.

Schedule

Configurable

---

# Security Jobs

Expired Token Cleanup

Remove expired refresh tokens.

Schedule

Hourly

---

Inactive Session Cleanup

Remove expired sessions.

Schedule

Hourly

---

# Maintenance Jobs

Temporary File Cleanup

Schedule

Daily

---

Old Log Cleanup

Archive or remove old logs.

Schedule

Weekly

---

Cache Refresh

Refresh application cache.

Schedule

Configurable

---

# Backup Jobs

Database Backup

Schedule

Daily

---

Media Backup

Schedule

Daily

---

Configuration Backup

Schedule

Weekly

---

# Health Check Jobs

Database Health Check

Schedule

Every 5 Minutes

---

Storage Health Check

Schedule

Hourly

---

Application Health Check

Schedule

Every 5 Minutes

---

# Job Status

PENDING

RUNNING

SUCCESS

FAILED

DISABLED

---

# APIs

GET /api/v1/jobs

GET /api/v1/jobs/:id

PATCH /api/v1/jobs/:id

POST /api/v1/jobs/:id/run

GET /api/v1/job-logs

GET /api/v1/job-logs/:id

---

# Validation Rules

Job Name must be unique.

Schedule must be valid.

Only administrators may execute manual jobs.

Disabled jobs cannot run automatically.

---

# Business Rules

Failed jobs must be logged.

Critical failures should trigger administrator notifications.

Jobs should be idempotent whenever possible.

Long-running jobs should support retries.

Job execution history must be preserved.

---

# Future Scope

Support

Distributed Job Queue

Priority Queue

Retry Policies

Job Dashboard

Real-time Monitoring

Cloud Scheduler

AI-Based Job Optimization

without redesign.

---

Status

Draft