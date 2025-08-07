# Product Requirements Document (PRD)
## PASS Attendance Tracker

### **Project Overview**
A mobile attendance tracking application that uses barcode/QR code scanning to record student attendance for courses. The app enables course leaders to efficiently manage attendance data and export reports.

### **Target Users**
- **Primary**: Course leaders/instructors
- **Secondary**: Educational administrators

### **Core Value Proposition**
Streamline attendance tracking from manual paper-based systems to automated digital scanning, reducing time spent on administrative tasks by 90%.

### **Key Features**
1. **Course Management**: Create and manage multiple courses
2. **Student Registration**: Register students with ID, name, and sponsor information
3. **Barcode Scanning**: Scan student ID cards for instant attendance logging
4. **Attendance Records**: View and manage attendance history per course
5. **Data Export**: Export attendance data to Excel/CSV formats
6. **Offline Support**: Work without internet connectivity

### **Application Screens & Functionality**

#### **1. Home Screen**
- **Purpose**: Main dashboard and course selection
- **Components**:
  - List of all created courses (course code + leader name)
  - "Create New Course" button
  - Course selection for attendance tracking
- **Actions**:
  - Navigate to course creation
  - Select course for attendance tracking
  - View course details

#### **2. Create Course Screen**
- **Purpose**: Add new courses to the system
- **Components**:
  - Course code input field (required, unique)
  - Leader name input field (required)
  - Save/Cancel buttons
- **Actions**:
  - Validate course code uniqueness
  - Save course data
  - Return to home screen

#### **3. Course Detail Screen**
- **Purpose**: View and manage specific course attendance
- **Components**:
  - Course information header (code + leader)
  - Attendance history list (newest first)
  - "Scan Attendance" button
  - "Export Data" button
  - Search/filter options
- **Actions**:
  - Navigate to scanning screen
  - Export attendance data
  - Filter attendance records

#### **4. Scan Screen**
- **Purpose**: Barcode scanning for attendance recording
- **Components**:
  - Camera preview with scanning overlay
  - Scan feedback indicators
  - Manual entry option
  - Current course display
  - Scan confirmation messages
- **Actions**:
  - Scan student ID barcodes/QR codes
  - Process and validate scanned data
  - Manual student ID entry fallback
  - Navigate to save attendance screen

#### **5. Save Attendance Screen**
- **Purpose**: Confirm and save attendance record
- **Components**:
  - Student information display (ID, name, sponsor)
  - Course information
  - Timestamp
  - Save/Cancel buttons
  - Edit student details option
- **Actions**:
  - Confirm attendance recording
  - Edit student information if needed
  - Save to database
  - Return to scanning or course screen

### **Data Models**

#### **Course**
- `courseCode`: string (primary key)
- `leaderName`: string

#### **Student**
- `studentId`: string (primary key)
- `studentName`: string
- `sponsor`: string

#### **Attendance**
- `id`: integer (auto-increment)
- `studentId`: string
- `studentName`: string
- `sponsor`: string
- `datetime`: string (ISO format)
- `courseCode`: string
- `leaderName`: string

### **Technical Constraints**
- Must work on mobile devices (iOS/Android)
- Offline-first architecture required
- Camera access for barcode scanning
- Local data storage with export capabilities
- Cross-platform compatibility
