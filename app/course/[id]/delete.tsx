import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ToastAndroid } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useCourse } from '@/contexts/CourseContext'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import Button from '@/components/Button'

export default function DeleteCourseScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { removeCourse } = useCourse()
    const { user } = useUser()
    const { colors, themeMode } = useTheme()
    const insets = useSafeAreaInsets()
    const [courseName, setCourseName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (id && user?.courses) {
            const course = user.courses.find(c => c.id === parseInt(id))
            if (course) {
                setCourseName(course.code)
            }
        }
    }, [id, user?.courses])

    const handleDelete = async () => {
        if (!id) {
            ToastAndroid.show('Course ID not found', ToastAndroid.SHORT)
            return
        }

        setIsLoading(true)
        try {
            await removeCourse(parseInt(id))
            ToastAndroid.show('Course deleted successfully', ToastAndroid.SHORT)
            router.back()
        } catch (error) {
            ToastAndroid.show('Failed to delete course', ToastAndroid.SHORT)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                title="Delete Course"
                showBackButton={true}
                showAvatar={false}
                showMenu={false}
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Text style={[styles.warningText, { color: colors.text }]}>
                        You are about to permanently delete the course "{courseName}". This action cannot be undone and will remove all associated attendance data.
                    </Text>
                </View>

                <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 6 }]}>
                    <Button
                        title="Delete Course"
                        onPress={handleDelete}
                        disabled={isLoading}
                        variant="danger"
                        isLoading={isLoading}
                        loadingText="Deleting..."
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 0
    },
    topSection: {
        // paddingTop: 32,
    },
    warningText: {
        fontSize: 16,
        textAlign: 'left',
        lineHeight: 24,
    },
    bottomSection: {
        // paddingBottom will be set dynamically using insets.bottom
    },
})
