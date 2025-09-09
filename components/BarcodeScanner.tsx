import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Camera, CameraView } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import { useCourse } from '@/contexts/CourseContext'
import { getStudentByStudentId, createStudent, updateStudentSignature, logAttendance } from '@/database/queries'

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

    const SCAN_COOLDOWN = 1000 // 1 second between scans

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

        try {
            if (scanState === ScanState.STUDENT_ID) {
                await handleStudentIdScan(data)
            } else if (scanState === ScanState.SIGNATURE) {
                await handleSignatureScan(data)
            }
        } catch (error) {
            console.error('Scanning error:', error)
            resetScanner()
        } finally {
            setIsProcessing(false)
        }
    }

    const handleStudentIdScan = async (studentId: string) => {
        try {
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
        } catch (error) {
            throw error
        }
    }

    const handleSignatureScan = async (signature: string) => {
        try {
            if (!currentStudent) {
                throw new Error('No student selected')
            }

            if (currentStudent.isNew) {
                // Create new student with signature
                const newStudent = await createStudent(currentStudent.studentId, signature)
                await logAttendance(newStudent.id, currentCourse!.id)

                // Call callback to update UI
                onAttendanceLogged?.(currentStudent.studentId)

                // Vibrate once for successful signature scan
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

            } else {
                // Check if signature matches existing student
                if (currentStudent.studentSignature === signature) {
                    await logAttendance(currentStudent.id, currentCourse!.id)

                    // Call callback to update UI
                    onAttendanceLogged?.(currentStudent.studentId)

                    // Vibrate once for successful signature scan
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

                } else {
                    // Longer vibration for failure (signature mismatch)
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                }
            } resetScanner()
        } catch (error) {
            throw error
        }
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