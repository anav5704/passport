import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import { useCourse } from '@/contexts/CourseContext'
import Header from '@/components/Header'
import Button from '@/components/Button'

export default function NewCourseScreen() {
    const { addCourse } = useCourse()
    const insets = useSafeAreaInsets()
    const [courseCode, setCourseCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        if (!courseCode.trim()) {
            Alert.alert('Error', 'Please enter a valid course code')
            return
        }

        setIsLoading(true)
        try {
            await addCourse(courseCode.trim())
            Alert.alert('Success', 'Course created successfully')
            router.back()
        } catch (error) {
            Alert.alert('Error', 'Failed to create course')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" translucent />

            <Header
                title="Add Course"
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

                <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 6 }]}>
                    <Button
                        title="Confirm"
                        onPress={handleConfirm}
                        disabled={isLoading}
                        isLoading={isLoading}
                        loadingText="Creating..."
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
        padding: 20,
        paddingBottom: 0
    },
    topSection: {
        // paddingTop: 32,
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
