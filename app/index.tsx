import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useUser } from '@/contexts/UserContext'
import { useCourse } from '@/contexts/CourseContext'
import { useSheet } from '@/contexts/SheetContext'
import Header from '@/components/Header'
import GeneralSettingsSheet from '@/components/sheets/GeneralSettingsSheet'
import CourseSwitcherSheet from '@/components/sheets/CourseSwitcherSheet'
import CourseSettingsSheet from '@/components/sheets/CourseSettingsSheet'

export default function Index() {
    const { user, isLoading } = useUser()
    const { currentCourse } = useCourse()
    const {
        generalSettingsRef,
        courseSwitcherRef,
        courseSettingsRef,
        openGeneralSettings,
        openCourseSwitcher,
        openCourseSettings,
        closeAllSheets
    } = useSheet()

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
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        )
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No user found</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header
                currentCourse={currentCourse || undefined}
                onAvatarPress={handleAvatarPress}
                onCourseTitlePress={handleCourseTitlePress}
                onMenuPress={handleMenuPress}
            />

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
        backgroundColor: '#fff',
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
})
