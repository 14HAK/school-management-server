# Database Design

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-21

Depends On:
- 00-project-overview.md
- 01-business-rules.md

---

# Purpose

This document defines the complete MongoDB database architecture for the School ERP System.

It serves as the single source of truth for all collections, relationships, indexes, and database rules.

---

# Database Engine

MongoDB

ODM:
Mongoose

Database Naming

school_erp

---

# Design Principles

- Normalized where appropriate
- Reference over embedding for reusable entities
- Embedded documents only for small immutable objects
- Soft Delete supported
- Audit fields in every collection
- Scalable for multi-campus institutions

---

# Common Fields

Every collection MUST contain:

_id

createdAt

updatedAt

createdBy

updatedBy

isDeleted

deletedAt

deletedBy

status

---

# Collection Groups

## Identity

users

roles

permissions

sessions

refreshTokens

otpRequests

activityLogs

auditLogs

---

## Organization

campuses

buildings

floors

rooms

---

## Academic

academicYears

sessionsAcademic

classes

sections

groups

subjects

classSubjects

teacherAssignments

studentEnrollments

---

## People

students

teachers

staff

guardians

---

## Routine

classRoutines

teacherRoutines

roomRoutines

routineTemplates

routineConflicts

---

## Attendance

studentAttendance

teacherAttendance

staffAttendance

attendanceLocks

---

## Examination

examTypes

exams

examSchedules

marks

grades

results

transcripts

---

## Finance

feeStructures

studentInvoices

payments

discounts

scholarships

expenses

salaryPayments

---

## Library

bookCategories

books

bookCopies

bookIssues

bookReturns

---

## Transport

vehicles

drivers

routes

stops

transportAssignments

---

## Hostel

hostels

hostelRooms

hostelAllocations

---

## Communication

notifications

noticeBoards

emails

smsLogs

pushNotifications

---

## Settings

systemSettings

academicSettings

securitySettings

emailSettings

smsSettings

---

# Relationship Overview

Campus

↓

Building

↓

Floor

↓

Room

↓

Section

↓

Student Enrollment

↓

Student

Teacher

↓

Teacher Assignment

↓

Subject

↓

Routine

---

# Student Relationship

User

↓

Student Profile

↓

Enrollment

↓

Class

↓

Section

↓

Group

---

# Teacher Relationship

User

↓

Teacher Profile

↓

Teacher Assignment

↓

Subject

↓

Section

---

# Subject Relationship

Subject

↓

Class Subject

↓

Teacher Assignment

↓

Routine

↓

Exam

↓

Marks

---

# Finance Relationship

Student

↓

Invoice

↓

Payment

↓

Receipt

---

# Reference Rules

Use ObjectId Reference for:

Users

Students

Teachers

Subjects

Rooms

Buildings

Academic Year

Invoices

Payments

Never duplicate these entities.

---

# Embedded Document Rules

Allowed:

Address

Emergency Contact

Guardian Snapshot

Academic History

Bank Information

Small Settings Objects

Do NOT embed large collections.

---

# Index Strategy

Unique Index

email

studentId

teacherId

roomNumber (per building)

academicYearCode

Compound Index

student + academicYear

teacher + subject

room + period

class + section

exam + subject

Text Index

studentName

teacherName

bookTitle

noticeTitle

---

# Soft Delete Strategy

Every important collection supports:

isDeleted

deletedAt

deletedBy

Queries should ignore deleted records by default.

---

# Transaction Rules

Transactions are required for:

Student Admission

Promotion

Fee Payment

Exam Publish

Salary Payment

Book Issue

Book Return

---

# Audit Rules

Every critical action creates:

Activity Log

Audit Log

---

# Scalability Rules

The database must support:

Multiple Campuses

Multiple Academic Years

Unlimited Students

Unlimited Teachers

Unlimited Subjects

Unlimited Buildings

without schema redesign.

---

# Future Collections

Online Classes

Assignments

Homework

Learning Materials

Live Classes

Parent Portal

Student Mobile App

Teacher Mobile App

AI Analytics

Biometric Attendance

Face Recognition

Payment Gateway

Document Management

---

Status

Draft