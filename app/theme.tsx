import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import Button from '@/components/Button'

type ThemeOption = 'light' | 'dark' | 'system'

export default function ThemeScreen() {
    const insets = useSafeAreaInsets()
    const { themeMode, setThemeMode, colors, actualTheme } = useTheme()
    const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(themeMode)
    const [isLoading, setIsLoading] = useState(false)

    const themeOptions: { value: ThemeOption; label: string; description: string }[] = [
        { value: 'light', label: 'Light', description: 'Always use light theme' },
        { value: 'dark', label: 'Dark', description: 'Always use dark theme' },
        { value: 'system', label: 'System', description: 'Match device settings' },
    ]

    const handleConfirm = async () => {
        setIsLoading(true)
        try {
            await setThemeMode(selectedTheme)
            Alert.alert('Success', 'Theme updated successfully')
            router.back()
        } catch (error) {
            Alert.alert('Error', 'Failed to save theme preference')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'} translucent />

            <Header
                title="Theme"
                showBackButton={true}
                showAvatar={false}
                showMenu={false}
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        Choose your preferred app theme
                    </Text>

                    <View style={styles.optionsContainer}>
                        {themeOptions.map((option) => (
                            <Pressable
                                key={option.value}
                                style={[
                                    styles.optionItem,
                                    {
                                        borderColor: colors.border,
                                        backgroundColor: colors.surface
                                    },
                                    selectedTheme === option.value && {
                                        borderColor: colors.primary,
                                        backgroundColor: actualTheme === 'dark' ? '#001122' : '#f0f8ff'
                                    }
                                ]}
                                onPress={() => setSelectedTheme(option.value)}
                            >
                                <View style={styles.optionContent}>
                                    <View style={styles.optionText}>
                                        <Text style={[
                                            styles.optionLabel,
                                            { color: colors.text },
                                            selectedTheme === option.value && { color: colors.primary }
                                        ]}>
                                            {option.label}
                                        </Text>
                                        <Text style={[
                                            styles.optionDescription,
                                            { color: colors.textSecondary },
                                            selectedTheme === option.value && { color: colors.primary }
                                        ]}>
                                            {option.description}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.radioButton,
                                        { borderColor: colors.border },
                                        selectedTheme === option.value && {
                                            backgroundColor: colors.primary,
                                            borderColor: colors.primary
                                        }
                                    ]}>
                                        {selectedTheme === option.value && (
                                            <Ionicons name="checkmark" size={16} color="#fff" />
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 6 }]}>
                    <Button
                        title="Confirm"
                        onPress={handleConfirm}
                        disabled={isLoading}
                        isLoading={isLoading}
                        loadingText="Saving..."
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
        flex: 1,
    },
    description: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    optionsContainer: {
        gap: 12,
    },
    optionItem: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
    },
    optionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    bottomSection: {
        // paddingBottom will be set dynamically using insets.bottom
    },
})
