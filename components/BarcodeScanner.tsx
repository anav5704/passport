import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform } from 'react-native'
import { Camera, CameraView } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import { useCourse } from '@/contexts/CourseContext'
import { getStudentByStudentId, createStudent, updateStudentSignature, logAttendance, getSessionsForCourse } from '@/database/queries'

interface BarcodeScannerProps {
    isActive: boolean
    onScanSuccess: (data: string) => void
    onAttendanceLogged?: (studentId: string) => void
}

enum ScanState {
    STUDENT_ID = 'STUDENT_ID',
    SIGNATURE = 'SIGNATURE',
    IDLE = 'IDLE'
}

export default function BarcodeScanner({ isActive, onScanSuccess, onAttendanceLogged }: BarcodeScannerProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [permissionResponse, setPermissionResponse] = useState<any>(null)
    const [scanState, setScanState] = useState<ScanState>(ScanState.IDLE)
    const [currentStudent, setCurrentStudent] = useState<any>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [lastScanTime, setLastScanTime] = useState(0)
    const { currentCourse } = useCourse()

    const SCAN_COOLDOWN = 1500 // 1.5 seconds between scans

    const getMostRecentSession = async () => {
        if (!currentCourse) {
            console.log('No current course for session lookup')
            return null
        }

        console.log('Looking for sessions for course ID:', currentCourse.id)

        try {
            const sessions = await getSessionsForCourse(currentCourse.id)
            console.log('Raw sessions data:', sessions)
            console.log('Found sessions count:', sessions.length)

            if (sessions.length === 0) {
                console.log('No sessions found for course', currentCourse.id)
                return null
            }

            // Log session details for debugging
            sessions.forEach((session, index) => {
                console.log(`Session ${index}:`, {
                    id: session.id,
                    timestamp: session.timestamp,
                    courseId: session.courseId
                })
            })

            // Return the most recent session (first in the array since they're ordered by date descending)
            const mostRecent = sessions[0]
            console.log('Most recent session:', mostRecent)
            return mostRecent
        } catch (error) {
            console.error('Error getting most recent session:', error)
            return null
        }
    }

    const getActiveSession = async () => {
        if (!currentCourse) {
            console.log('No current course for active session lookup')
            return null
        }

        try {
            const sessions = await getSessionsForCourse(currentCourse.id)
            console.log('Checking for active sessions:', sessions.length)

            if (sessions.length === 0) {
                console.log('No sessions found for course', currentCourse.id)
                return null
            }

            const now = new Date()

            // Find the first session that is active (same day and same hour)
            for (const session of sessions) {
                const sessionTime = new Date(session.timestamp)

                // Check if it's the same day
                const isSameDay = sessionTime.toDateString() === now.toDateString()

                if (isSameDay) {
                    // Check if current time is within the same hour as session start
                    const sessionHour = sessionTime.getHours()
                    const currentHour = now.getHours()

                    if (sessionHour === currentHour) {
                        console.log('Found active session:', session)
                        return session
                    }
                }
            }

            console.log('No active sessions found')
            return null
        } catch (error) {
            console.error('Error getting active session:', error)
            return null
        }
    }

    useEffect(() => {
        getCameraPermissions()
    }, [])

    const getCameraPermissions = async () => {
        try {
            // First check if we already have permission
            const { status } = await Camera.getCameraPermissionsAsync()

            if (status === 'granted') {
                setHasPermission(true)
            } else {
                // Request permission - this triggers the native dialog
                const response = await Camera.requestCameraPermissionsAsync()
                setPermissionResponse(response)
                setHasPermission(response.status === 'granted')
            }
        } catch (error) {
            console.error('Error requesting camera permission:', error)
            setHasPermission(false)
        }
    }

    // Manual permission request for when user taps to grant permission
    const requestCameraPermission = async () => {
        try {
            // This will trigger the native permission dialog
            const response = await Camera.requestCameraPermissionsAsync()
            setPermissionResponse(response)
            setHasPermission(response.status === 'granted')
        } catch (error) {
            console.error('Error requesting camera permission:', error)
            setHasPermission(false)
        }
    }

    useEffect(() => {
        if (isActive && hasPermission) {
            setScanState(ScanState.STUDENT_ID)
        } else {
            setScanState(ScanState.IDLE)
        }
    }, [isActive, hasPermission])

    const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
        const now = Date.now()

        // Prevent rapid successive scans
        if (now - lastScanTime < SCAN_COOLDOWN) {
            return
        }

        if (isProcessing || !currentCourse) return

        // Validate scan format based on current state
        if (scanState === ScanState.STUDENT_ID) {
            // Student ID must start with "S" followed by exactly 8 digits
            if (!/^S\d{8}$/.test(data)) {
                return // Ignore invalid student ID format
            }
        } else if (scanState === ScanState.SIGNATURE) {
            // Signature must start with "US", followed by 6 digits, then "P"
            if (!/^US\d{6}P$/.test(data)) {
                return // Ignore invalid signature format
            }
        }

        setLastScanTime(now)
        setIsProcessing(true)

        if (scanState === ScanState.STUDENT_ID) {
            await handleStudentIdScan(data)
        } else if (scanState === ScanState.SIGNATURE) {
            await handleSignatureScan(data)
        }

        setIsProcessing(false)
    }

    const handleStudentIdScan = async (studentId: string) => {
        // Additional check to prevent duplicate processing
        if (isProcessing) {
            return
        }

        // Vibrate once for student ID scan
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

        const existingStudent = await getStudentByStudentId(studentId)

        if (existingStudent) {
            // Student exists, wait for signature
            setCurrentStudent(existingStudent)
            setScanState(ScanState.SIGNATURE)
        } else {
            // Student doesn't exist, create new student and wait for signature
            setCurrentStudent({ studentId, isNew: true })
            setScanState(ScanState.SIGNATURE)
        }
    }

    const handleSignatureScan = async (signature: string) => {
        if (!currentStudent) {
            console.error('No student selected for signature scan')
            resetScanner()
            return
        }

        // Additional check to prevent duplicate processing
        if (isProcessing) {
            return
        }

        if (currentStudent.isNew) {
            // Create new student with signature
            const newStudent = await createStudent(currentStudent.studentId, signature)

            // Get the active session for attendance logging
            const activeSession = await getActiveSession()
            console.log('Logging attendance for new student:', newStudent.id, 'with session:', activeSession)

            if (activeSession) {
                const attendanceResult = await logAttendance(newStudent.id, activeSession.id)

                if (attendanceResult.ok) {
                    console.log('Attendance logged successfully')
                    // Call callback to update UI
                    onAttendanceLogged?.(currentStudent.studentId)
                    // Vibrate once for successful signature scan
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                } else {
                    console.log('Error logging attendance:', attendanceResult.error)
                    // Show toast for duplicate attendance
                    if (Platform.OS === 'android') {
                        ToastAndroid.show(attendanceResult.error, ToastAndroid.LONG)
                    } else {
                        console.log('Attendance error:', attendanceResult.error)
                    }
                    // Vibrate for error
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                    // Reset scanner after error
                    resetScanner()
                    return
                }
            } else {
                console.warn('No active session found, skipping attendance logging')
                // Show toast notification
                const toastMessage = 'No sessions in progress'
                if (Platform.OS === 'android') {
                    ToastAndroid.show(toastMessage, ToastAndroid.LONG)
                } else {
                    console.log('No active sessions:', toastMessage)
                }
                // Vibrate for error
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                // Reset scanner after error
                resetScanner()
                return
            }

        } else {
            // Check if signature matches existing student
            if (currentStudent.studentSignature === signature) {
                // Get the active session for attendance logging
                const activeSession = await getActiveSession()
                console.log('Logging attendance for existing student:', currentStudent.id, 'with session:', activeSession)

                if (activeSession) {
                    const attendanceResult = await logAttendance(currentStudent.id, activeSession.id)

                    if (attendanceResult.ok) {
                        console.log('Attendance logged successfully')
                        // Call callback to update UI
                        onAttendanceLogged?.(currentStudent.studentId)
                        // Vibrate once for successful signature scan
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    } else {
                        console.log('Error logging attendance:', attendanceResult.error)
                        // Show toast for duplicate attendance
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(attendanceResult.error, ToastAndroid.LONG)
                        } else {
                            console.log('Attendance error:', attendanceResult.error)
                        }
                        // Vibrate for error
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                        // Reset scanner after error
                        resetScanner()
                        return
                    }
                } else {
                    console.warn('No active session found, skipping attendance logging')
                    // Show toast notification
                    const toastMessage = 'No sessions in progress'
                    if (Platform.OS === 'android') {
                        ToastAndroid.show(toastMessage, ToastAndroid.LONG)
                    } else {
                        console.log('No active sessions:', toastMessage)
                    }
                    // Vibrate for error
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                    // Reset scanner after error
                    resetScanner()
                    return
                }

            } else {
                // Signature mismatch - show error toast and vibrate
                const toastMessage = 'Signature does not match'
                if (Platform.OS === 'android') {
                    ToastAndroid.show(toastMessage, ToastAndroid.LONG)
                } else {
                    console.log('Signature mismatch:', toastMessage)
                }
                // Longer vibration for failure (signature mismatch)
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                // Reset scanner after signature mismatch
                resetScanner()
                return
            }
        }

        resetScanner()
    }

    const resetScanner = () => {
        setCurrentStudent(null)
        setScanState(isActive ? ScanState.STUDENT_ID : ScanState.IDLE)
    }

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            </View>
        )
    }

    if (hasPermission === false) {
        return null
    }

    if (!currentCourse) {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>No course selected</Text>
            </View>
        )
    }

    if (!isActive) {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>Scanner inactive</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'code93', 'codabar', 'upc_a', 'upc_e'],
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 150, // Fixed height (approximately 1/4 of screen)
        backgroundColor: '#000',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
        textAlignVertical: 'center',
    },
    subMessageText: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})