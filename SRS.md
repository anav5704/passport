# Software Requirements Specification 

## Functional Requirements

1. Onboarding

- FR1.1: The system shall allow user to enter name on first launch.
- FR1.2: The system shall allow adding at least one course during onboarding.

2. Course Management

- FR2.1: The system shall allow adding, editing, deleting courses.
- FR2.2: The system shall allow switching between available courses.
- FR2.3: The system shall allow exporting attendance as CSV/XLS.

3. Attendance Tracking

- FR3.1: The system shall allow scanning student Id barcode.
- FR3.2: After Id scan, The system shall wait for signature barcode scan.
- FR3.3: The system shall record attendance entry with timestamp.
- FR3.4: The system shall display attendance history in reverse chronological order.

4. User Settings

- FR4.1: The system shall allow editing leader name.
- FR4.2: The system shall respect system theme (dark/light).

## User Stories

* As a leader, I want to scan student Ids and signatures so that attendance is recorded quickly.
* As a leader, I want to see recent attendance history so I can confirm students were added.
* As a leader, I want to export attendance so I can submit records.
* As a leader, I want to manage courses so I can handle multiple units.
* As a leader, I want to edit my name so records are personalized.
* As a leader, I want the app to respect my system theme so the UI feels natural.

## User Flows

### Onboarding Flow

1. First launch → Enter leader name → Add course(s) → Go to Course Screen.

### Course Flow

1. Open app → Course screen shows.
2. Tap course title → Bottom sheet → Switch course.
3. Tap 3-dot → Bottom sheet → Export / Edit / Delete course.

### Attendance Flow

1. Open app → Scanner active.
2. Scan student Id → App waits for signature scan.
3. Scan signature → Entry added to history list (with timestamp).

### User Settings Flow

1. Tap avatar → Bottom sheet → Edit name.
2. Save → Update across app.
