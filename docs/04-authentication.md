# Authentication

Version: 1.0.0

Status: Draft

Last Updated: 2026-07-21

Depends On

- 00-project-overview.md
- 01-business-rules.md
- 02-database-design.md
- 03-folder-structure.md

---

# Purpose

This document defines the complete authentication system of the School ERP.

Every user who accesses the system must be authenticated before accessing protected resources.

This module is responsible for:

- User Registration
- Login
- Logout
- Refresh Token
- Email Verification
- OTP Verification
- Forgot Password
- Reset Password
- Change Password
- Session Management

---

# Supported Account Types

The authentication system supports all user types.

- Super Admin
- Admin
- Principal
- Vice Principal
- Teacher
- Staff
- Accountant
- Librarian
- Student
- Guardian

Authentication does not depend on the profile type.

Every account is authenticated through the User collection.

---

# Authentication Strategy

The backend uses JWT based authentication.

Two tokens are used.

## Access Token

Purpose

Authenticate API requests.

Storage

HttpOnly Cookie

Lifetime

15 Minutes

---

## Refresh Token

Purpose

Generate new Access Token.

Storage

HttpOnly Cookie

Lifetime

7 Days

---

# Authentication Flow

User Login

↓

Validate Email

↓

Validate Password

↓

Check Account Status

↓

Generate Access Token

↓

Generate Refresh Token

↓

Save Refresh Token

↓

Send Cookies

↓

Login Success

---

# User Registration Flow

Register Request

↓

Validate Request

↓

Check Existing Email

↓

Create User

↓

Hash Password

↓

Generate Verification OTP

↓

Send Email

↓

Registration Completed

Account remains unverified until email verification.

---

# Login Rules

A user can login only if:

- Email exists
- Password is correct
- Account is active
- Email is verified

Otherwise login must fail.

---

# Logout Rules

Logout must:

- Remove Access Token
- Remove Refresh Token
- Invalidate Current Session
- Record Activity Log

---

# Session Rules

Every login creates a session.

A session contains:

- User
- Device
- Browser
- IP Address
- Login Time
- Expiration Time

---

# Password Rules

Password Requirements

Minimum Length

8 Characters

Must contain

- Uppercase Letter
- Lowercase Letter
- Number
- Special Character

Passwords are stored only as hashed values.

---

# Password Hashing

Algorithm

bcrypt

Salt Rounds

12

Passwords must never be decrypted.

---

# Email Verification

Every new account must verify email.

Verification uses OTP.

OTP expires after:

10 Minutes

---

# Forgot Password

Flow

Request Email

↓

Generate OTP

↓

Send Email

↓

Verify OTP

↓

Reset Password

---

# Change Password

Requirements

User must be logged in.

User must provide:

- Current Password
- New Password

Current password must match before updating.

---

# Token Rules

Access Token

Contains

- User ID
- Role IDs
- Token Version

Refresh Token

Contains

- User ID
- Session ID

---

# Account Status

Possible Status

ACTIVE

INACTIVE

SUSPENDED

BLOCKED

PENDING_VERIFICATION

Only ACTIVE accounts can login.

---

# Cookies

Access Token Cookie

HttpOnly

Secure

SameSite=Strict

Refresh Token Cookie

HttpOnly

Secure

SameSite=Strict

---

# Activity Logs

The following actions must be logged.

- Register
- Login
- Logout
- Forgot Password
- Reset Password
- Password Change
- Email Verification

---

# Authentication APIs

POST /api/v1/auth/register

POST /api/v1/auth/login

POST /api/v1/auth/logout

POST /api/v1/auth/refresh-token

POST /api/v1/auth/forgot-password

POST /api/v1/auth/reset-password

POST /api/v1/auth/change-password

POST /api/v1/auth/verify-email

POST /api/v1/auth/resend-otp

GET /api/v1/auth/me

---

# Future Scope

The authentication module should support:

- Google Login
- Microsoft Login
- Two-Factor Authentication (2FA)
- Multi Device Login
- Single Sign-On (SSO)

without major redesign.

---

Status

Draft