import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useUser } from '@/contexts'
import { Header, BottomSheets, BottomSheetsRef } from '@/components'

export default function Index() {
    const { user, isLoading } = useUser()
    const [currentCourse, setCurrentCourse] = useState<{ id: number; code: string } | undefined>()
    const bottomSheetsRef = useRef<BottomSheetsRef>(null)

    // Set the first course as default when user loads
    useEffect(() => {
        if (user?.courses && user.courses.length > 0 && !currentCourse) {
            setCurrentCourse(user.courses[0])
        }
    }, [user, currentCourse])

    const handleCourseSwitch = (courseId: number) => {
        const course = user?.courses?.find(c => c.id === courseId)
        if (course) {
            setCurrentCourse(course)
        }
    }

    const handleAvatarPress = () => {
        bottomSheetsRef.current?.openUserSettings()
    }

    const handleCourseTitlePress = () => {
        bottomSheetsRef.current?.openCourseSwitcher()
    }

    const handleMenuPress = () => {
        bottomSheetsRef.current?.openCourseManagement()
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
                currentCourse={currentCourse}
                onAvatarPress={handleAvatarPress}
                onCourseTitlePress={handleCourseTitlePress}
                onMenuPress={handleMenuPress}
            />

            {/* Scanner Area (top 1/4 screen) */}
            <View style={styles.scannerArea}>
                <View style={styles.scannerFrame}>
                    <Text style={styles.scannerText}>Scanner Active</Text>
                    <Text style={styles.scannerSubText}>
                        Scan Student ID first, then signature
                    </Text>
                </View>
            </View>

            {/* Attendance History (remaining 3/4 screen) */}
            <View style={styles.attendanceHistory}>
                {/* Empty state for now */}
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No attendance yet.</Text>
                    <Text style={styles.emptyStateSubText}>
                        Start scanning student IDs to record attendance
                    </Text>
                </View>
            </View>

            {/* Bottom Sheets */}
            <BottomSheets
                ref={bottomSheetsRef}
                currentCourse={currentCourse}
                onCourseSwitch={handleCourseSwitch}
            />
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
    scannerArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        margin: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderStyle: 'dashed',
    },
    scannerFrame: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scannerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    scannerSubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    attendanceHistory: {
        flex: 3,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    emptyStateSubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
})
