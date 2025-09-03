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
        bottomSheetsRef.current?.openAppSettings()
    }

    const handleCourseTitlePress = () => {
        bottomSheetsRef.current?.openCourseSwitcher()
    }

    const handleMenuPress = () => {
        bottomSheetsRef.current?.openCourseSettings()
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
})
