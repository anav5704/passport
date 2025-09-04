import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import { useCourse } from '@/contexts/CourseContext'
import { useUser } from '@/contexts/UserContext'
import Header from '@/components/Header'
import Button from '@/components/Button'

export default function UpdateCourseScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { updateCourseCode } = useCourse()
    const { user } = useUser()
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
            Alert.alert('Error', 'Please enter a valid course code')
            return
        }

        if (!id) {
            Alert.alert('Error', 'Course ID not found')
            return
        }

        setIsLoading(true)
        try {
            await updateCourseCode(parseInt(id), courseCode.trim())
            Alert.alert('Success', 'Course updated successfully')
            router.back()
        } catch (error) {
            Alert.alert('Error', 'Failed to update course')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" translucent />

            <Header
                title="Edit Course"
                showBackButton={true}
                showAvatar={false}
                showMenu={false}
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Text style={styles.label}>Course Code</Text>
                    <TextInput
                        style={styles.input}
                        value={courseCode}
                        onChangeText={setCourseCode}
                        placeholder="Enter course code"
                        returnKeyType="done"
                        onSubmitEditing={handleConfirm}
                        autoCapitalize="characters"
                    />
                </View>

                <View style={[styles.bottomSection, { paddingBottom: insets.bottom || 20 }]}>
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
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20, // Add bottom padding for better spacing from nav bar
    },
    topSection: {
        paddingTop: 32,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    bottomSection: {
        // paddingBottom will be set dynamically using insets.bottom
    },
})
