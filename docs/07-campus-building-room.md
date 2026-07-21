# Campus, Building & Room Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-21

Depends On

- 00-project-overview.md
- 01-business-rules.md
- 02-database-design.md
- 03-folder-structure.md
- 06-user-management.md

---

# Purpose

This document defines the physical infrastructure of the School ERP.

The Academy collection represents all physical rooms and facilities inside the institution.

---

# Campus

Current Version

Single Campus

Future

Support Multiple Campuses

---

# Buildings

Current Buildings

ACA-RED

ACA-GREEN

Every building contains multiple floors and rooms.

---

# Floor Structure

Ground Floor

First Floor

Second Floor

Third Floor

Future floors can be added without redesign.

---

# Academy Collection

Purpose

Store every physical room.

Collection

academies

---

# Academy Fields

_id

buildingName

roomNumber

floor

roomType

status

capacity

description

facilities

relatedUsers

createdAt

updatedAt

---

# Building Names

ACA-RED

ACA-GREEN

---

# Room Number Format

RM01

RM02

RM03

...

RM70

Room numbers must be unique inside a building.

---

# Room Types

CLASSROOM

LAB

COMPUTER_LAB

LIBRARY

PRINCIPAL_OFFICE

STAFF_ROOM

FINANCE_ROOM

AUDITORIUM

CAFETERIA

MOSQUE

STORE_ROOM

WASHROOM

BATHROOM

GATE

MEDICAL_ROOM

EXAM_ROOM

---

# Room Status

AVAILABLE

OCCUPIED

RESERVED

MAINTENANCE

CLOSED

---

# Facilities

Whiteboard

Projector

Smart TV

WiFi

Air Conditioner

Computer

Printer

Sound System

CCTV

Generator Backup

---

# Classroom Allocation

Class 1

RM02

RM03

---

Class 2

RM04

RM05

---

Class 3

RM06

RM07

---

Class 4

RM12

RM13

---

Class 5

RM14

RM15

---

Class 6

RM16

RM17

---

Class 7

RM22

RM23

---

Class 8

RM24

RM25

---

Class 9

RM32

RM33

RM34

---

Class 10

RM35

RM36

RM37

---

SSC

RM18

RM28

RM38

---

# Principal Office

RM01

---

# Teacher Rooms

RM08

RM11

RM21

RM31

---

# Auditorium

RM51

RM52

RM53

RM54

RM55

RM56

RM57

---

# Computer Labs

RM58

RM70

---

# Science Labs

RM61

RM62

RM63

---

# Store Rooms

RM64

RM65

RM66

---

# Finance Rooms

RM67

RM68

RM69

---

# Cafeteria

RM41

RM42

RM43

---

# Mosque

RM45

RM46

RM47

---

# Security

RM48

Gateman

Cleaner

---

# Washrooms

RM09

RM19

RM29

RM39

RM49

RM59

---

# Bathrooms

RM10

RM20

RM30

RM40

RM50

RM60

---

# Related Users

Every room may have related users.

Examples

Teacher

Student

Staff

---

# Room Rules

One room has one type.

One room belongs to one building.

One room belongs to one floor.

A classroom cannot host multiple classes during the same routine period.

A room under maintenance cannot be assigned.

---

# Capacity Rules

Capacity must be greater than zero.

Routine generation must check room capacity.

---

# APIs

POST /api/v1/academies

GET /api/v1/academies

GET /api/v1/academies/:id

PATCH /api/v1/academies/:id

DELETE /api/v1/academies/:id

GET /api/v1/academies/buildings

GET /api/v1/academies/floors

GET /api/v1/academies/rooms

---

# Future Scope

Future versions may support

Multiple Campuses

Hostel Buildings

Playgrounds

Medical Buildings

Conference Buildings

Research Buildings

without redesign.

---

Status

Draft