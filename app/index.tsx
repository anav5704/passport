import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from '@/contexts/UserContext'
import { useCourse } from '@/contexts/CourseContext'
import { useSheet } from '@/contexts/SheetContext'
import { useTheme } from '@/contexts/ThemeContext'
import { getAttendanceHistoryForCourse } from '@/database/queries'
import Header from '@/components/Header'
import BarcodeScanner from '@/components/BarcodeScanner'
import GeneralSettingsSheet from '@/components/sheets/GeneralSettingsSheet'
import CourseSwitcherSheet from '@/components/sheets/CourseSwitcherSheet'
import CourseSettingsSheet from '@/components/sheets/CourseSettingsSheet'

export default function Index() {
    const { user, isLoading } = useUser()
    const { currentCourse } = useCourse()
    const { colors, themeMode } = useTheme()
    const insets = useSafeAreaInsets()
    const [attendanceHistory, setAttendanceHistory] = useState<any[]>([])
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(false)
    const {
        generalSettingsRef,
        courseSwitcherRef,
        courseSettingsRef,
        openGeneralSettings,
        openCourseSwitcher,
        openCourseSettings,
        closeAllSheets
    } = useSheet()

    // Function to format timestamp as "6 Sep, 10.00am"
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        const day = date.getDate().toString() // Remove padStart to avoid leading zeros
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const month = months[date.getMonth()]
        const hours24 = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours24 >= 12 ? 'pm' : 'am'
        const displayHours = hours24 === 0 ? 12 : (hours24 > 12 ? hours24 - 12 : hours24)
        const displayMinutes = minutes.toString().padStart(2, '0')
        return `${day} ${month}, ${displayHours}.${displayMinutes}${ampm}`
    }

    useEffect(() => {
        const fetchAttendanceHistory = async () => {
            if (!currentCourse) {
                setAttendanceHistory([])
                return
            }

            try {
                setIsLoadingAttendance(true)
                const history = await getAttendanceHistoryForCourse(currentCourse.id)
                setAttendanceHistory(history)
            } catch (error) {
                console.error('Error fetching attendance history:', error)
                setAttendanceHistory([])
            } finally {
                setIsLoadingAttendance(false)
            }
        }

        fetchAttendanceHistory()
    }, [currentCourse])

    const addNewAttendance = (studentId: string) => {
        const timestamp = new Date().toISOString()
        const newAttendance = {
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // unique temporary ID
            studentId,
            timestamp,
            courseId: currentCourse?.id
        }

        // Add to top of list
        setAttendanceHistory(prev => [newAttendance, ...prev])
    }

    const handleAvatarPress = () => {
        openGeneralSettings()
    }

    const handleCourseTitlePress = () => {
        openCourseSwitcher()
    }

    const handleMenuPress = () => {
        openCourseSettings()
    }

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
            </View>
        )
    }

    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.danger }]}>No user found</Text>
            </View>
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <Header
                currentCourse={currentCourse || undefined}
                onAvatarPress={handleAvatarPress}
                onCourseTitlePress={handleCourseTitlePress}
                onMenuPress={handleMenuPress}
            />

            {/* Main Content */}
            <View style={styles.content}>
                {/* Barcode Scanner */}
                <View style={styles.scannerSection}>
                    <BarcodeScanner
                        isActive={!!currentCourse}
                        onScanSuccess={(data) => console.log('Scanned:', data)}
                        onAttendanceLogged={addNewAttendance}
                    />
                </View>

                {/* Attendance History */}
                <View style={styles.statsSection}>
                    {currentCourse && attendanceHistory.length > 0 && !isLoadingAttendance && (
                        <FlashList
                            data={attendanceHistory}
                            keyExtractor={(item, index) => `${item.id}-${item.studentId}-${index}`}
                            renderItem={({ item, index }) => (
                                <View style={[
                                    styles.attendanceItem,
                                    { backgroundColor: colors.surface, borderColor: colors.border },
                                    index < attendanceHistory.length - 1 && styles.attendanceItemWithMargin
                                ]}>
                                    <Text style={[styles.studentId, { color: colors.text }]}>{item.studentId}</Text>
                                    <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{formatTimestamp(item.timestamp)}</Text>
                                </View>
                            )}
                            style={styles.attendanceList}
                            contentContainerStyle={{ paddingBottom: insets.bottom }}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>

            {/* Sheet Components */}
            <GeneralSettingsSheet ref={generalSettingsRef} />
            <CourseSwitcherSheet ref={courseSwitcherRef} />
            <CourseSettingsSheet ref={courseSettingsRef} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingBottom: 0
    },
    scannerSection: {

    },
    statsSection: {
        flex: 1,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        flex: 1,
        textAlignVertical: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#ff4444',
        textAlign: 'center',
        flex: 1,
        textAlignVertical: 'center',
    },
    attendanceList: {
        flex: 1,
        marginTop: 20
    },
    attendanceItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f4f4f5', // zinc-100 equivalent
    },
    attendanceItemWithMargin: {
        marginBottom: 20,
    },
    studentId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    timestamp: {
        fontSize: 14,
        color: '#666',
    },
})
