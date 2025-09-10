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
import SessionList from '@/components/SessionList'

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
                            <SessionList
                                sessions={sessions}
                                onSessionPress={handleSessionPress}
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
})
