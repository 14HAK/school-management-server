# Library Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 06-user-management.md
- 08-academic.md

---

# Purpose

This document defines the library management system.

The library module manages books, book copies, issuing, returning, fines and borrowing history.

---

# Core Collections

books

bookCategories

authors

publishers

bookCopies

bookIssues

libraryCards

libraryFines

---

# Book

Collection

books

Fields

_id

isbn

title

subtitle

categoryId

authorId

publisherId

edition

language

publishYear

description

coverImage

status

createdAt

updatedAt

---

# Book Category

Collection

bookCategories

Fields

_id

name

description

status

---

# Author

Collection

authors

Fields

_id

name

biography

country

status

---

# Publisher

Collection

publishers

Fields

_id

name

address

phone

email

status

---

# Book Copy

Collection

bookCopies

Fields

_id

bookId

copyNumber

barcode

rackNumber

shelfNumber

condition

status

createdAt

updatedAt

---

# Library Card

Collection

libraryCards

Fields

_id

userId

cardNumber

issueDate

expiryDate

status

---

# Book Issue

Collection

bookIssues

Fields

_id

bookCopyId

userId

issuedBy

issueDate

dueDate

returnDate

fineAmount

remarks

status

---

# Fine

Collection

libraryFines

Fields

_id

bookIssueId

amount

reason

paid

paidDate

---

# Book Condition

NEW

GOOD

USED

DAMAGED

LOST

---

# Book Status

AVAILABLE

ISSUED

RESERVED

LOST

DAMAGED

ARCHIVED

---

# Issue Status

ISSUED

RETURNED

OVERDUE

LOST

---

# Library Rules

Every physical book copy has a unique Barcode.

One Book may have multiple Book Copies.

One Book Copy can be issued to only one user at a time.

A Book Copy cannot be issued if its status is not AVAILABLE.

---

# Borrowing Rules

Student

Maximum Borrow Limit

(Configurable)

Teacher

Maximum Borrow Limit

(Configurable)

Staff

Maximum Borrow Limit

(Configurable)

Borrow limits should be configurable through system settings.

---

# Fine Rules

Fine starts after Due Date.

Fine calculation may be:

Per Day

Fixed Amount

Configurable

---

# APIs

POST /api/v1/books

GET /api/v1/books

GET /api/v1/books/:id

PATCH /api/v1/books/:id

DELETE /api/v1/books/:id

---

POST /api/v1/book-copies

GET /api/v1/book-copies

PATCH /api/v1/book-copies/:id

---

POST /api/v1/book-issues

GET /api/v1/book-issues

PATCH /api/v1/book-issues/:id

POST /api/v1/book-issues/return

---

POST /api/v1/library-cards

GET /api/v1/library-cards

---

GET /api/v1/library-fines

PATCH /api/v1/library-fines/:id

---

# Validation Rules

ISBN should be unique.

Barcode must be unique.

Library Card Number must be unique.

A user cannot issue the same Book Copy twice simultaneously.

Return Date cannot be earlier than Issue Date.

Fine Amount cannot be negative.

---

# Business Rules

Deleting a Book must not remove issue history.

Deleting a User must not remove borrowing history.

Lost books must remain in historical records.

Library transactions are immutable after completion.

---

# Future Scope

Support

Barcode Scanner

QR Code

RFID Integration

Digital Library

E-Books

Book Reservation Queue

SMS & Email Reminder

Automatic Fine Calculation

without redesign.

---

Status

Draft