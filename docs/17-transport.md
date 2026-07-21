# Transport Management

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

This document defines the transport management system.

The transport module manages vehicles, drivers, routes, pickup points, transport assignments and transport fees.

---

# Core Collections

vehicles

drivers

transportRoutes

transportStops

transportAssignments

transportFees

---

# Vehicle

Collection

vehicles

Fields

_id

vehicleNumber

registrationNumber

vehicleType

brand

model

seatCapacity

driverId

status

createdAt

updatedAt

---

# Driver

Collection

drivers

Fields

_id

userId

licenseNumber

licenseExpiryDate

phone

emergencyContact

status

createdAt

updatedAt

---

# Transport Route

Collection

transportRoutes

Fields

_id

routeName

routeCode

description

status

createdAt

updatedAt

---

# Transport Stop

Collection

transportStops

Fields

_id

routeId

stopName

stopOrder

pickupTime

dropTime

status

---

# Transport Assignment

Collection

transportAssignments

Fields

_id

studentId

academicYearId

vehicleId

routeId

stopId

assignedDate

status

createdAt

updatedAt

---

# Transport Fee

Collection

transportFees

Fields

_id

transportAssignmentId

amount

paymentStatus

remarks

createdAt

updatedAt

---

# Vehicle Status

ACTIVE

INACTIVE

MAINTENANCE

OUT_OF_SERVICE

---

# Driver Status

ACTIVE

INACTIVE

ON_LEAVE

SUSPENDED

---

# Assignment Status

ACTIVE

INACTIVE

COMPLETED

CANCELLED

---

# Route Rules

One Route may have multiple Stops.

One Stop belongs to one Route.

One Vehicle may operate on one or more Routes (configurable).

One Student can have only one ACTIVE Transport Assignment.

---

# Transport Workflow

Create Vehicle

↓

Create Driver

↓

Create Route

↓

Add Stops

↓

Assign Vehicle

↓

Assign Student

↓

Generate Fee

↓

Completed

---

# APIs

POST /api/v1/vehicles

GET /api/v1/vehicles

GET /api/v1/vehicles/:id

PATCH /api/v1/vehicles/:id

DELETE /api/v1/vehicles/:id

---

POST /api/v1/drivers

GET /api/v1/drivers

PATCH /api/v1/drivers/:id

---

POST /api/v1/transport-routes

GET /api/v1/transport-routes

PATCH /api/v1/transport-routes/:id

DELETE /api/v1/transport-routes/:id

---

POST /api/v1/transport-stops

GET /api/v1/transport-stops

PATCH /api/v1/transport-stops/:id

---

POST /api/v1/transport-assignments

GET /api/v1/transport-assignments

PATCH /api/v1/transport-assignments/:id

DELETE /api/v1/transport-assignments/:id

---

GET /api/v1/transport-fees

PATCH /api/v1/transport-fees/:id

---

# Validation Rules

Vehicle Number must be unique.

Registration Number must be unique.

Driver License Number must be unique.

Route Code must be unique.

Stop Order must be unique within the same Route.

Student must have an ACTIVE Enrollment.

Only ACTIVE Vehicles and Drivers can be assigned.

---

# Business Rules

A Vehicle cannot exceed its Seat Capacity.

A Driver cannot be assigned to two Vehicles at the same time.

Transport Fee depends on the assigned Route.

Deleting a Route must not remove transport history.

Historical transport records are read-only.

---

# Future Scope

Support

GPS Tracking

Live Vehicle Location

RFID Student Check-in

QR Code Boarding

Parent Mobile Tracking

Fuel Management

Vehicle Maintenance Log

Route Optimization

Emergency Alerts

without redesign.

---

Status

Draft