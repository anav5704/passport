import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import { useCourse } from '@/contexts/CourseContext'
import { getStudentByStudentId, createStudent, updateStudentSignature, logAttendance } from '@/database/queries'

interface BarcodeScannerProps {
    isActive: boolean
    onAttendanceLogged?: (studentId: string) => void
}

enum ScanState {
    STUDENT_ID = 'STUDENT_ID',
    SIGNATURE = 'SIGNATURE',
    IDLE = 'IDLE'
}

export default function BarcodeScanner({ isActive, onAttendanceLogged }: BarcodeScannerProps) {
    const [permission, requestPermission] = useCameraPermissions()
    const [scanState, setScanState] = useState<ScanState>(ScanState.IDLE)
    const [currentStudent, setCurrentStudent] = useState<any>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [lastScanTime, setLastScanTime] = useState(0)
    const { currentCourse } = useCourse()

    const SCAN_COOLDOWN = 1000 // 2 seconds between scans

    useEffect(() => {
        if (isActive && permission?.granted) {
            setScanState(ScanState.STUDENT_ID)
        } else {
            setScanState(ScanState.IDLE)
        }
    }, [isActive, permission?.granted])

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

                // Vibrate twice for success (new student)
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                setTimeout(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                }, 200)

            } else {
                // Check if signature matches existing student
                if (currentStudent.studentSignature === signature) {
                    await logAttendance(currentStudent.id, currentCourse!.id)

                    // Call callback to update UI
                    onAttendanceLogged?.(currentStudent.studentId)

                    // Vibrate twice for success (signature match)
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    setTimeout(() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    }, 200)

                } else {
                    // One longer vibrate for failure (signature mismatch)
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

                }
            }

            resetScanner()
        } catch (error) {
            throw error
        }
    }

    const resetScanner = () => {
        setCurrentStudent(null)
        setScanState(isActive ? ScanState.STUDENT_ID : ScanState.IDLE)
    }

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>Requesting camera permission...</Text>
            </View>
        )
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>Camera permission required</Text>
                <Text style={styles.subMessageText} onPress={requestPermission}>
                    Tap to grant permission
                </Text>
            </View>
        )
    }

    if (!currentCourse) {
        return (
            <View style={styles.container}>
                <Text style={styles.messageText}>No course selected</Text>
                <Text style={styles.subMessageText}>Please select a course to start scanning</Text>
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
})
