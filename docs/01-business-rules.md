# Business Rules

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-21

Depends On:
- 00-project-overview.md

---

# Purpose

This document defines the business rules of the School ERP System.

Every backend API, database schema, validation rule, and frontend feature must follow these rules.

If a future feature conflicts with this document, this document has higher priority unless officially updated.

---

# General Rules

1. Every record must have a unique ObjectId.
2. Every record must contain createdAt and updatedAt.
3. Soft Delete must be used whenever possible.
4. Hard Delete is only allowed for Super Admin.
5. Every important action must be logged.
6. Every API must validate input.
7. Every API must return a standard response format.
8. Every protected API requires authentication.
9. Every protected API requires permission checking.
10. All dates must be stored in UTC.

---

# Organization Rules

1. One system may support multiple campuses.
2. One campus may contain multiple buildings.
3. One building may contain multiple floors.
4. One floor may contain multiple rooms.
5. Every room belongs to exactly one floor.
6. A room cannot belong to multiple floors.

---

# Academic Rules

1. Academic Year is mandatory.
2. Session is mandatory.
3. Student enrollment always belongs to one Academic Year.
4. Student promotion creates a new enrollment.
5. Enrollment history must never be deleted.

---

# User Rules

1. Every login account is a User.
2. Every User must have at least one Role.
3. User authentication information is stored separately from profile information.
4. One User may have multiple Roles.
5. One User may own only one profile for each profile type.

Example:

User
 ├── Teacher Profile
 ├── Student Profile
 └── Staff Profile

---

# Student Rules

1. Student profile never stores current class directly.
2. Student class information comes from Enrollment.
3. Student can have multiple enrollment records.
4. Previous enrollments must remain unchanged.
5. Student ID must be unique.

---

# Teacher Rules

1. Teacher assignment is created every Academic Year.
2. A Teacher may teach multiple subjects.
3. A Teacher may teach multiple sections.
4. A Teacher cannot have two classes at the same time.

---

# Subject Rules

1. Subject is independent.
2. Class Subject defines which subjects belong to which class.
3. Subject names must not be duplicated.

---

# Room Rules

1. Every room has one room type.
2. Every room has one status.
3. Room numbers must be unique inside a building.
4. Room capacity cannot be negative.

---

# Routine Rules

1. One teacher cannot teach two classes in the same period.
2. One room cannot host two classes in the same period.
3. Break periods cannot contain classes.
4. Holidays cannot contain classes.
5. Manual override is allowed.

---

# Attendance Rules

1. Attendance can only be submitted once per day.
2. Attendance cannot be modified after lock.
3. Attendance history must remain available.

---

# Examination Rules

1. Every Exam belongs to an Academic Year.
2. Every Exam belongs to one Exam Type.
3. Marks cannot exceed Full Marks.
4. Published results become read-only.

---

# Finance Rules

1. Every invoice belongs to one student.
2. Every payment belongs to one invoice.
3. Payment history is immutable.
4. Discounts must be recorded.
5. Scholarships must be recorded.

---

# Security Rules

1. Passwords must never be stored in plain text.
2. Passwords must always be hashed.
3. JWT access tokens must expire.
4. Refresh tokens must be revocable.
5. Sensitive operations require authorization.

---

# Audit Rules

The following events must be logged:

- Login
- Logout
- Student Admission
- Teacher Creation
- Fee Payment
- Result Publication
- Role Change
- Permission Change

---

# Naming Rules

Collections:
camelCase

API:
kebab-case

Database Fields:
camelCase

Environment Variables:
UPPER_CASE

---

# API Rules

Every API must include:

- Validation
- Authentication (if required)
- Authorization (if required)
- Error Handling
- Logging

---

# Future Rules

The architecture must support:

- College
- Madrasa
- Coaching Center
- Polytechnic
- Training Institute

without major database redesign.

---

Status

Draft

This document will be updated as the project grows.