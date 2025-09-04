import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useCourse } from '@/contexts/CourseContext'
import { useUser } from '@/contexts/UserContext'

export default function DeleteCourseScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { removeCourse } = useCourse()
    const { user } = useUser()
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
            Alert.alert('Error', 'Course ID not found')
            return
        }

        Alert.alert(
            'Delete Course',
            `Are you sure you want to delete "${courseName}"? This action cannot be undone and will remove all associated attendance data.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoading(true)
                        try {
                            await removeCourse(parseInt(id))
                            Alert.alert('Success', 'Course deleted successfully')
                            router.back()
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete course')
                        } finally {
                            setIsLoading(false)
                        }
                    },
                },
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" translucent />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Delete Course</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Text style={styles.warningText}>
                        You are about to permanently delete the course "{courseName}". This action cannot be undone and will remove all associated attendance data.
                    </Text>
                </View>

                <View style={styles.bottomSection}>
                    <Pressable
                        style={[styles.deleteButton, isLoading && styles.deleteButtonDisabled]}
                        onPress={handleDelete}
                        disabled={isLoading}
                    >
                        <Text style={styles.deleteButtonText}>
                            {isLoading ? 'Deleting...' : 'Delete Course'}
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
    warningText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'left',
        lineHeight: 24,
    },
    bottomSection: {
        paddingBottom: 40, // Increased padding to ensure it's above nav bar
        paddingHorizontal: 20, // Add horizontal padding for better spacing
    },
    deleteButton: {
        backgroundColor: '#F43F5E',
        borderRadius: 9999, // This creates the pill shape (rounded-full equivalent)
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})
