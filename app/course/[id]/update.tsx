import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ToastAndroid } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useCourse } from '@/contexts/CourseContext'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '@/utils/designConstants'

export default function UpdateCourseScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { updateCourseCode } = useCourse()
    const { user } = useUser()
    const { colors, themeMode } = useTheme()
    const insets = useSafeAreaInsets()
    const [courseCode, setCourseCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (id && user?.courses) {
            const course = user.courses.find(c => c.id === parseInt(id))
            if (course) {
                setCourseCode(course.code)
            }
        }
    }, [id, user?.courses])

    const handleConfirm = async () => {
        if (!courseCode.trim()) {
            ToastAndroid.show('Enter a valid course code', ToastAndroid.SHORT)
            return
        }

        if (!id) {
            ToastAndroid.show('Course ID not found', ToastAndroid.SHORT)
            return
        }

        setIsLoading(true)
        try {
            await updateCourseCode(parseInt(id), courseCode.trim())
            ToastAndroid.show('Course updated successfully', ToastAndroid.SHORT)
            router.back()
        } catch (error) {
            ToastAndroid.show('Failed to update course', ToastAndroid.SHORT)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                title="Edit Course"
                showBackButton={true}
                showAvatar={false}
                showMenu={false}
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Text style={[styles.label, { color: colors.text }]}>Course Code</Text>
                    <TextInput
                        value={courseCode}
                        onChangeText={setCourseCode}
                        placeholder="Enter course code"
                        returnKeyType="done"
                        autoCapitalize="characters"
                    />
                </View>

                <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 6 }]}>
                    <Button
                        title="Confirm"
                        onPress={handleConfirm}
                        disabled={isLoading}
                        isLoading={isLoading}
                        loadingText="Updating..."
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
        padding: SPACING.xl,
        paddingBottom: 0
    },
    topSection: {
        // paddingTop: 32,
    },
    label: {
        fontSize: FONT_SIZE.base,
        fontWeight: FONT_WEIGHT.medium,
        marginBottom: SPACING.md,
    },
    bottomSection: {
        // paddingBottom will be set dynamically using insets.bottom
    },
})
