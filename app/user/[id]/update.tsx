import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import Button from '@/components/Button'
import TextInput from '@/components/TextInput'

export default function UpdateUserScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { user, updateUserName } = useUser()
    const { colors, themeMode } = useTheme()
    const insets = useSafeAreaInsets()
    const [name, setName] = useState(user?.name || '')
    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a valid name')
            return
        }

        if (!user) {
            Alert.alert('Error', 'User not found')
            return
        }

        // Verify the ID matches the current user
        if (id && parseInt(id) !== user.id) {
            Alert.alert('Error', 'Invalid user ID')
            return
        }

        setIsLoading(true)
        try {
            await updateUserName(name.trim())
            Alert.alert('Success', 'Name updated successfully')
            router.back()
        } catch (error) {
            Alert.alert('Error', 'Failed to update name')
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
                        onSubmitEditing={handleConfirm}
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
        padding: 20,
        paddingBottom: 0
    },
    topSection: {
        // paddingTop: 32,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    bottomSection: {
        // paddingBottom will be set dynamically using insets.bottom
    },
})
