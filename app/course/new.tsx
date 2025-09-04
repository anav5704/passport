import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useCourse } from '@/contexts/CourseContext'

export default function NewCourseScreen() {
    const { addCourse } = useCourse()
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
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" translucent />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Add Course</Text>
                <View style={styles.headerSpacer} />
            </View>

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

                <View style={styles.bottomSection}>
                    <Pressable
                        style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
                        onPress={handleConfirm}
                        disabled={isLoading}
                    >
                        <Text style={styles.confirmButtonText}>
                            {isLoading ? 'Creating...' : 'Confirm'}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },
    headerSpacer: {
        width: 32, // Same width as back button to center the title
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
        paddingBottom: 40, // Increased padding to ensure it's above nav bar
        paddingHorizontal: 20, // Add horizontal padding for better spacing
    },
    confirmButton: {
        backgroundColor: '#009ca3',
        borderRadius: 9999, // This creates the pill shape (rounded-full equivalent)
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonDisabled: {
        opacity: 0.6,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})
