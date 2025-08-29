# Product Requirements Document 

Application name: PASSport
Platforms: Android
Version: 4

## Overview

What is PASS?

The Peer Assisted Study Sessions (PASS) program is a student support initiative where trained senior students (PASS Leaders) facilitate group study sessions for students enrolled in challenging courses.

What do PASS Leaders do?

- Run study sessions for their assigned course(s).
- Take attendance of participants each week.
- Submit attendance data to the PASS Coordinator.

What will this app do for them?

- Allow leaders to quickly and accurately record attendance using barcode scanning.
- Store all attendance data offline for reliability (no internet required in sessions).
- Provide an easy way to manage courses and export attendance for submission.
- Simplify workflows (minimal screens, intuitive UI, fast feedback).

## Screens

### 1. Onboarding Screen

- Welcome Message & Image

- Registration Form

    - Leader name
    - Course code(s)

### 2. Course Screen (Main Page)

- Header

    - Avatar icon (tap → user settings bottom sheet)
    - Course title (tap → switch course bottom sheet)
    - 3-dot menu (tap → course management bottom sheet)

- Scanner Area (top 1/4 screen)

    - Always active rectangle barcode scanner
    - Scan flow: Student ID → Signature → Record attendance

- Attendance History (remaining 3/4 screen)

    - List of attendance entries (student Id, timestamp)
    - Empty state: “No attendance yet.”

## Bottom Sheets

### Course Switcher

- Shows leader’s courses
- Tap → switch active course
- Crate course

### Course Management (3-dot menu)

- Export attendance
- Edit course
- Delete course

### User Settings (Avatar)

- Edit leader name

## Technology Stack

Framework: React Native (Expo)
Navigation: Expo Router (file based routing)
UI Components: Custom + @gorhom/react-native-bottom-sheet
Barcode Scanner: Expo Camera
Database: Expo SQLite + Drizzle ORM
Data Export: xlsx 
Distribution : Expo EAS

## Database Schema

User 
    - id     INTEGER PRIMARY KEY AUTOINCREMENT
    - name        TEXT NOT NULL

Course 
    - id   INTEGER PRIMARY KEY AUTOINCREMENT
    - code        TEXT NOT NULL
    - leader_id   INTEGER NOT NULL
    - FOREIGN KEY (leader_id) REFERENCES User(id)

Student 
    - id   INTEGER PRIMARY KEY AUTOINCREMENT
    - student_id TEXT NOT NULL,
    - student_signature TEXT NOT NULL,

Attendance 
    - attendance_id  INTEGER PRIMARY KEY AUTOINCREMENT
    - student_id     INTEGER NOT NULL
    - course_id      INTEGER NOT NULL
    - timestamp      DATETIME DEFAULT CURRENT_TIMESTAMP
    - FOREIGN KEY (student_id) REFERENCES Student(id)
    - FOREIGN KEY (course_id) REFERENCES Course(id)