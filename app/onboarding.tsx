import React, { useState, useRef } from 'react'
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { setupUserWithCourse } from '@database/queries'
import { StatusBar } from 'expo-status-bar'
import { useUser } from '@/contexts'
import { router } from 'expo-router'

export default function OnboardingScreen() {
    const [leaderName, setLeaderName] = useState('')
    const [courseCode, setCourseCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { refreshUser } = useUser()

    // Refs for TextInput components
    const nameInputRef = useRef<TextInput>(null)
    const courseInputRef = useRef<TextInput>(null)

    const updateCourseCode = (value: string) => {
        // Format course code: remove spaces and convert to uppercase
        setCourseCode(value.replace(/\s/g, '').toUpperCase())
    }

    const handleComplete = async () => {
        // Validate fields
        const isNameValid = leaderName.trim() !== ''
        const isCourseValid = courseCode.trim() !== ''

        // Focus first invalid field
        if (!isNameValid) {
            nameInputRef.current?.focus()
            return
        }

        if (!isCourseValid) {
            courseInputRef.current?.focus()
            return
        }

        setIsLoading(true)

        try {
            // Setup user with course
            await setupUserWithCourse(leaderName, courseCode)

            // Refresh user context
            await refreshUser()

            // Navigate to main app
            router.replace('/')
        } catch (error) {
            console.error('Error setting up user:', error)
            Alert.alert('Error', 'Failed to set up your account. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome to PASSport</Text>
                        <Text style={styles.subtitle}>
                            Let's set up your account to start tracking attendance for your PASS sessions
                        </Text>
                    </View>

                    {/* Leader Name Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Your Name</Text>
                        <TextInput
                            ref={nameInputRef}
                            style={styles.input}
                            value={leaderName}
                            onChangeText={setLeaderName}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Courses Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Course Code</Text>

                        <TextInput
                            ref={courseInputRef}
                            style={styles.input}
                            value={courseCode}
                            onChangeText={updateCourseCode}
                            autoCapitalize="characters"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Complete Button */}
                    <Pressable
                        style={styles.completeButton}
                        onPress={handleComplete}
                        disabled={isLoading}
                    >
                        <Text style={styles.completeButtonText}>
                            {isLoading ? 'Setting up...' : 'Complete Setup'}
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    completeButton: {
        backgroundColor: '#009ca3',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 24,
    },
    completeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
})
