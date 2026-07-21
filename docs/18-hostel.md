# Hostel Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 06-user-management.md
- 08-academic.md
- 11-student-enrollment.md
- 15-finance.md

---

# Purpose

This document defines the hostel management system.

The hostel module manages hostel buildings, rooms, beds, student allocation, hostel fees and visitor records.

---

# Core Collections

hostels

hostelRooms

hostelBeds

hostelAllocations

hostelFees

hostelVisitors

wardens

---

# Hostel

Collection

hostels

Fields

_id

hostelName

hostelCode

gender

description

status

createdAt

updatedAt

---

# Hostel Room

Collection

hostelRooms

Fields

_id

hostelId

roomNumber

floor

capacity

status

createdAt

updatedAt

---

# Hostel Bed

Collection

hostelBeds

Fields

_id

roomId

bedNumber

status

createdAt

updatedAt

---

# Hostel Allocation

Collection

hostelAllocations

Fields

_id

studentId

academicYearId

hostelId

roomId

bedId

allocationDate

checkoutDate

status

remarks

createdAt

updatedAt

---

# Hostel Fee

Collection

hostelFees

Fields

_id

hostelAllocationId

amount

paymentStatus

remarks

createdAt

updatedAt

---

# Warden

Collection

wardens

Fields

_id

userId

hostelId

phone

status

createdAt

updatedAt

---

# Visitor

Collection

hostelVisitors

Fields

_id

studentId

visitorName

relationship

phone

visitDate

checkInTime

checkOutTime

remarks

status

---

# Hostel Status

ACTIVE

INACTIVE

MAINTENANCE

CLOSED

---

# Room Status

AVAILABLE

FULL

MAINTENANCE

RESERVED

---

# Bed Status

AVAILABLE

ALLOCATED

MAINTENANCE

BLOCKED

---

# Allocation Status

ACTIVE

COMPLETED

TRANSFERRED

CANCELLED

---

# Hostel Rules

One Hostel has multiple Rooms.

One Room has multiple Beds.

One Bed belongs to one Room.

One Student can have only one ACTIVE Hostel Allocation.

A Bed cannot be allocated to multiple students simultaneously.

---

# Hostel Workflow

Create Hostel

↓

Create Rooms

↓

Create Beds

↓

Assign Warden

↓

Allocate Student

↓

Generate Hostel Fee

↓

Completed

---

# APIs

POST /api/v1/hostels

GET /api/v1/hostels

PATCH /api/v1/hostels/:id

DELETE /api/v1/hostels/:id

---

POST /api/v1/hostel-rooms

GET /api/v1/hostel-rooms

PATCH /api/v1/hostel-rooms/:id

---

POST /api/v1/hostel-beds

GET /api/v1/hostel-beds

PATCH /api/v1/hostel-beds/:id

---

POST /api/v1/hostel-allocations

GET /api/v1/hostel-allocations

PATCH /api/v1/hostel-allocations/:id

POST /api/v1/hostel-allocations/transfer

POST /api/v1/hostel-allocations/checkout

---

POST /api/v1/hostel-visitors

GET /api/v1/hostel-visitors

---

GET /api/v1/hostel-fees

PATCH /api/v1/hostel-fees/:id

---

# Validation Rules

Hostel Code must be unique.

Room Number must be unique within the same Hostel.

Bed Number must be unique within the same Room.

Student must have an ACTIVE Enrollment.

Only AVAILABLE Beds can be allocated.

Checkout Date cannot be earlier than Allocation Date.

---

# Business Rules

A Student cannot occupy multiple Beds simultaneously.

Deleting a Hostel must not remove allocation history.

Completed Allocations are read-only.

Visitor logs must be preserved.

Hostel Fees follow the Finance Module.

---

# Future Scope

Support

Hostel Attendance

Meal Management

Laundry Management

Maintenance Requests

Guardian Visit Approval

QR Code Entry

RFID Access

Biometric Access

without redesign.

---

Status

Draft