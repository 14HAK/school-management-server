# Subject Management

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-22

Depends On

- 00-project-overview.md
- 01-business-rules.md
- 02-database-design.md
- 06-user-management.md
- 07-campus-building-room.md
- 08-academic.md

---

# Purpose

This document defines subject management for all academic classes.

Subjects are assigned according to class level.

Teachers are assigned based on subjects.

Routine, Attendance, Examination and Result modules depend on this module.

---

# Subject Collection

Collection Name

subjects

---

# Subject Fields

_id

subjectCode

subjectName

subjectNameBn

classLevel

group

isOptional

bookUrl

description

status

createdAt

updatedAt

---

# Subject Status

ACTIVE

INACTIVE

ARCHIVED

---

# Subject Rules

Every Subject belongs to one Class.

One Subject may have multiple Teachers.

One Teacher may teach multiple Subjects.

Subject Code must be unique.

Subject Name must not be duplicated within the same Class.

---

# Class Wise Subjects

## Class 1

Total Subjects

4

Subjects

- বাংলা
- English
- গণিত
- ঈমান

Book

https://nctb.gov.bd/pages/static-pages/6922df96933eb65569e22edc

---

## Class 2

Total Subjects

4

Subjects

- বাংলা
- English
- গণিত
- ঈমান

Book

https://nctb.gov.bd/pages/static-pages/6922df53933eb65569e213a9

---

## Class 3

Total Subjects

7

Subjects

- বাংলা
- English
- গণিত
- ইসলাম
- ঈমান
- বিজ্ঞান
- বিশ্বপরিচয়

Book

https://nctb.gov.bd/pages/static-pages/6922e04b933eb65569e265f3

---

## Class 4

Total Subjects

7

Subjects

- বাংলা
- English
- গণিত
- ইসলাম
- ঈমান
- বিজ্ঞান
- বিশ্বপরিচয়

---

## Class 5

Total Subjects

7

Subjects

- বাংলা
- English
- গণিত
- ইসলাম
- ঈমান
- বিজ্ঞান
- বিশ্বপরিচয়

---

## Class 6

Total Subjects

11

Subjects

- বাংলা
- বাংলা ২য়
- English
- English 2nd
- গণিত
- ইসলাম
- ঈমান
- বিজ্ঞান
- বিশ্বপরিচয়
- ICT
- কৃষি

---

## Class 7

Total Subjects

11

Subjects

- বাংলা
- বাংলা ২য়
- English
- English 2nd
- গণিত
- ইসলাম
- ঈমান
- বিজ্ঞান
- বিশ্বপরিচয়
- ICT
- কৃষি

---

## Class 8

Total Subjects

11

Subjects

- বাংলা
- বাংলা ২য়
- English
- English 2nd
- গণিত
- ইসলাম
- ঈমান
- বিজ্ঞান
- বিশ্বপরিচয়
- ICT
- কৃষি

---

## Class 9

Groups

Science

Commerce

Humanities

Total Subjects

23

Subjects

- বাংলা
- বাংলা ২য়
- English
- English 2nd
- গণিত
- ইসলাম
- ঈমান
- বিশ্বপরিচয়
- ICT
- কৃষি
- পদার্থবিজ্ঞান
- রসায়ন
- জীববিজ্ঞান
- উচ্চতর গণিত
- বিজ্ঞান
- ভূগোল ও পরিবেশ
- অর্থনীতি
- কৃষিশিক্ষা
- পৌরনীতি ও নাগরিকতা
- হিসাববিজ্ঞান
- ফিন্যান্স ও ব্যাংকিং
- ব্যবসায় উদ্যোগ

---

## Class 10

Same as Class 9

---

## SSC

Same as Class 10

---

# APIs

POST /api/v1/subjects

GET /api/v1/subjects

GET /api/v1/subjects/:id

PATCH /api/v1/subjects/:id

DELETE /api/v1/subjects/:id

GET /api/v1/subjects/class/:classLevel

GET /api/v1/subjects/group/:group

---

# Validation Rules

Subject Code must be unique.

Subject Name is required.

Class Level is required.

Group is optional below Class 9.

Book URL is optional.

---

# Future Scope

Support

Elective Subjects

Optional Subjects

Practical Subjects

Digital Books

Multiple Curriculum

without redesign.

---

Status

Draft