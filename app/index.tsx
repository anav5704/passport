import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useUser } from '@/contexts/UserContext'
import { useCourse } from '@/contexts/CourseContext'
import { useSheet } from '@/contexts/SheetContext'
import { useSession } from '@/contexts/SessionContext'
import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import BarcodeScanner from '@/components/BarcodeScanner'
import GeneralSettingsSheet from '@/components/sheets/GeneralSettingsSheet'
import CourseSwitcherSheet from '@/components/sheets/CourseSwitcherSheet'
import CourseSettingsSheet from '@/components/sheets/CourseSettingsSheet'

export default function Index() {
    const { user, isLoading } = useUser()
    const { currentCourse } = useCourse()
    const { colors, themeMode } = useTheme()
    const { sessions, sessionHistory, isLoading: isLoadingHistory, refreshSessions } = useSession()
    const insets = useSafeAreaInsets()
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
        const day = date.getDate().toString()
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

    // Function to check if session is active
    const isSessionActive = (timestamp: string) => {
        const sessionTime = new Date(timestamp)
        const now = new Date()

        // Check if it's the same day
        const isSameDay = sessionTime.toDateString() === now.toDateString()

        if (!isSameDay) return false

        // Check if current time is within the same hour as session start
        const sessionHour = sessionTime.getHours()
        const currentHour = now.getHours()

        return sessionHour === currentHour
    }

    // Function to format session display: "Mon 23 Jun, 10am"
    const formatSessionDisplay = (timestamp: string) => {
        const date = new Date(timestamp)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const day = days[date.getDay()]
        const dayOfMonth = date.getDate()
        const month = months[date.getMonth()]
        const hours24 = date.getHours()
        const ampm = hours24 >= 12 ? 'pm' : 'am'
        const displayHours = hours24 === 0 ? 12 : (hours24 > 12 ? hours24 - 12 : hours24)
        return `${day} ${dayOfMonth} ${month}, ${displayHours}${ampm}`
    }

    const addNewAttendance = async (studentId: string) => {
        // Refresh session data to update attendance counts
        await refreshSessions()
    }

    const handleAvatarPress = () => {
        openGeneralSettings()
    }

    const handleCoursePress = () => {
        openCourseSwitcher()
    }

    const handleMenuPress = () => {
        openCourseSettings()
    }

    const handleSessionPress = (sessionId: number) => {
        router.push(`/session/${sessionId}`)
    }

    if (isLoading || !user) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                currentCourse={currentCourse || undefined}
                onAvatarPress={handleAvatarPress}
                onCourseTitlePress={handleCoursePress}
                onMenuPress={handleMenuPress}
            />
            <View style={[styles.content, { paddingBottom: insets.bottom }]}>

                {currentCourse && (
                    <View style={styles.scannerSection}>
                        <BarcodeScanner
                            isActive={!!currentCourse}
                            onScanSuccess={(data) => console.log('Scanned:', data)}
                            onAttendanceLogged={addNewAttendance}
                        />
                    </View>
                )}

                {/* Session History */}
                <View style={styles.statsSection}>
                    {currentCourse && sessions.length > 0 && !isLoadingHistory && (
                        <View style={styles.attendanceList}>
                            <FlashList
                                data={sessions}
                                keyExtractor={(item: any, index) => `session-${item.id}-${index}`}
                                estimatedItemSize={100}
                                renderItem={({ item, index }) => {
                                    const isActive = isSessionActive(item.timestamp)
                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.attendanceItem,
                                                {
                                                    backgroundColor: colors.surface,
                                                    borderColor: isActive ? '#009ca3' : colors.border
                                                },
                                                index < sessions.length - 1 && styles.attendanceItemWithMargin
                                            ]}
                                            onPress={() => handleSessionPress(item.id)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.sessionInfo}>
                                                <Text style={[styles.studentId, { color: colors.text }]}>
                                                    {formatSessionDisplay(item.timestamp)}
                                                </Text>
                                                <Text style={[styles.attendanceCount, { color: colors.textSecondary }]}>
                                                    {item.attendanceCount || 0} student{(item.attendanceCount || 0) !== 1 ? 's' : ''} attended
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                                contentContainerStyle={{ paddingBottom: insets.bottom }}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
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
        paddingBottom: 0,
    },
    scannerSection: {
    },
    statsSection: {
        flex: 1,
    },
    loadingText: {
        fontSize: 16,
        color: '#333',
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
        borderColor: '#f4f4f5',
    },
    attendanceItemWithMargin: {
        marginBottom: 20,
    },
    sessionInfo: {
        flex: 1,
    },
    studentId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    attendanceCount: {
        fontSize: 14,
        color: '#666',
    },
})
