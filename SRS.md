# Software Requirements Specification (SRS)
## PASS Attendance Tracker

### **Functional Requirements**

#### **FR1: Course Management**
- **FR1.1**: Create new courses with unique course codes and leader names
- **FR1.2**: View list of all created courses
- **FR1.3**: Select active course for attendance tracking
- **FR1.4**: Validate course code uniqueness

#### **FR2: Student Management**
- **FR2.1**: Register students with ID, name, and sponsor information
- **FR2.2**: Store student data locally for offline access
- **FR2.3**: Automatic student registration during first scan
- **FR2.4**: Update existing student information

#### **FR3: Attendance Tracking**
- **FR3.1**: Scan barcodes/QR codes from student ID cards
- **FR3.2**: Record attendance with timestamp and course association
- **FR3.3**: Display real-time confirmation of successful scan
- **FR3.4**: Handle duplicate scans within same session
- **FR3.5**: Manual attendance entry as fallback option

#### **FR4: Data Visualization**
- **FR4.1**: Display attendance history for selected course
- **FR4.2**: Show student details in attendance records
- **FR4.3**: Sort attendance by date/time (newest first)
- **FR4.4**: Filter attendance by date range

#### **FR5: Data Export**
- **FR5.1**: Export attendance data to Excel format (.xlsx)
- **FR5.2**: Include all relevant fields (ID, name, sponsor, timestamp, course)
- **FR5.3**: Generate filename with course code and leader name
- **FR5.4**: Share exported files via device sharing options

#### **FR6: Navigation & UI**
- **FR6.1**: Intuitive navigation between screens
- **FR6.2**: Clear visual feedback for all user actions
- **FR6.3**: Responsive design for various screen sizes
- **FR6.4**: Dark mode support

### **Non-Functional Requirements**

#### **NFR1: Performance**
- **NFR1.1**: App launch time < 3 seconds
- **NFR1.2**: Barcode scan response time < 1 second
- **NFR1.3**: Database queries complete within 500ms
- **NFR1.4**: Export generation < 10 seconds for 1000 records

#### **NFR2: Reliability**
- **NFR2.1**: 99.9% uptime for offline functionality
- **NFR2.2**: Data persistence across app restarts
- **NFR2.3**: Graceful error handling and recovery
- **NFR2.4**: Automatic data backup mechanisms

#### **NFR3: Usability**
- **NFR3.1**: Intuitive interface requiring < 5 minutes learning time
- **NFR3.2**: Accessibility compliance (screen readers, high contrast)
- **NFR3.3**: Single-handed operation capability
- **NFR3.4**: Clear error messages and user guidance

#### **NFR4: Security**
- **NFR4.1**: Local data encryption at rest
- **NFR4.2**: No sensitive data transmission
- **NFR4.3**: Secure file sharing protocols
- **NFR4.4**: Data integrity validation

#### **NFR5: Compatibility**
- **NFR5.1**: Android 8.0+ and iOS 12.0+ support
- **NFR5.2**: Portrait and landscape orientation support
- **NFR5.3**: Various screen sizes (phones, tablets)
- **NFR5.4**: Camera hardware compatibility

#### **NFR6: Maintainability**
- **NFR6.1**: Modular architecture for easy updates
- **NFR6.2**: Comprehensive error logging
- **NFR6.3**: Version control and rollback capabilities
- **NFR6.4**: Database migration support

### **System Constraints**
- **Offline-first operation** (no internet dependency)
- **Mobile device deployment** only
- **Local storage limitations** (device dependent)
- **Camera permission** requirements
- **File system access** for exports

### **Assumptions**
- Students have standardized ID cards with barcodes/QR codes
- Course leaders have basic smartphone operation skills
- Device has sufficient storage for attendance data
- Camera quality supports barcode scanning
