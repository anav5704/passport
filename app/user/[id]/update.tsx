import React, { useState } from 'react'
import { View, Text, StyleSheet, ToastAndroid } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '@/utils/designConstants'

export default function UpdateUserScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { user, updateUserName } = useUser()
    const { colors, themeMode } = useTheme()
    const insets = useSafeAreaInsets()
    const [name, setName] = useState(user?.name || '')
    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        if (!name.trim()) {
            ToastAndroid.show('Enter a valid name', ToastAndroid.SHORT)
            return
        }

        if (!user) {
            ToastAndroid.show('User not found', ToastAndroid.SHORT)
            return
        }

        // Verify the ID matches the current user
        if (id && parseInt(id) !== user.id) {
            ToastAndroid.show('Invalid user ID', ToastAndroid.SHORT)
            return
        }

        setIsLoading(true)
        try {
            const result = await updateUserName(name.trim())
            if (!result.ok) {
                ToastAndroid.show(result.error, ToastAndroid.SHORT)
                return
            }
            ToastAndroid.show('Name updated successfully', ToastAndroid.SHORT)
            router.back()
        } catch (error) {
            ToastAndroid.show('Failed to update name', ToastAndroid.SHORT)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                title="Edit Name"
                showBackButton={true}
                showAvatar={false}
                showMenu={false}
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        returnKeyType="done"
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
