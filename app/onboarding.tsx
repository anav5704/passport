import React, { useState } from 'react'
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ToastAndroid,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { setupUserWithCourse } from '@database/queries'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import { router } from 'expo-router'
import TextInput from '@/components/TextInput'
import Button from '@/components/Button'

export default function OnboardingScreen() {
    const [leaderName, setLeaderName] = useState('')
    const [courseCode, setCourseCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { refreshUser } = useUser()
    const { colors, themeMode } = useTheme()

    // Refs for TextInput components - no longer needed for auto-focus
    // const nameInputRef = useRef<RNTextInput>(null)
    // const courseInputRef = useRef<RNTextInput>(null)

    const updateCourseCode = (value: string) => {
        // Format course code: remove spaces and convert to uppercase
        setCourseCode(value.replace(/\s/g, '').toUpperCase())
    }

    const handleComplete = async () => {
        // Validate fields
        const isNameValid = leaderName.trim() !== ''
        const isCourseValid = courseCode.trim() !== ''

        // Show toast for first invalid field
        if (!isNameValid) {
            ToastAndroid.show('Enter a valid name', ToastAndroid.SHORT)
            return
        }

        if (!isCourseValid) {
            ToastAndroid.show('Enter a valid course code', ToastAndroid.SHORT)
            return
        }

        setIsLoading(true)

        try {
            // Setup user with course
            const result = await setupUserWithCourse(leaderName, courseCode)

            if (!result.ok) {
                ToastAndroid.show(result.error, ToastAndroid.SHORT)
                return
            }

            // Refresh user context
            await refreshUser()

            // Navigate to main app
            router.replace('/')
        } catch (error) {
            ToastAndroid.show('Setup failed. Try again.', ToastAndroid.SHORT)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={[]}>
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: colors.background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Welcome to PASSport</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Let's set up your account to start tracking attendance for your PASS sessions
                        </Text>
                    </View>

                    {/* Leader Name Section */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.text }]}>Your Name</Text>
                        <TextInput
                            value={leaderName}
                            onChangeText={setLeaderName}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Courses Section */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: colors.text }]}>Course Code</Text>

                        <TextInput
                            value={courseCode}
                            onChangeText={updateCourseCode}
                            autoCapitalize="characters"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Complete Button */}
                    <Button
                        title="Complete Setup"
                        onPress={handleComplete}
                        isLoading={isLoading}
                        loadingText="Setting up..."
                        disabled={isLoading}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
})
