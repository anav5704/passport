import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import { useUser } from '@/contexts/UserContext'
import Header from '@/components/Header'
import Button from '@/components/Button'

export default function UpdateUserScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { user, updateUserName } = useUser()
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
        <View style={styles.container}>
            <StatusBar style="dark" translucent />

            <Header
                title="Edit Name"
                showBackButton={true}
                showAvatar={false}
                showMenu={false}
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
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
