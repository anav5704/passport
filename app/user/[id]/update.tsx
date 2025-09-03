import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useUser } from '@/contexts/UserContext'

export default function UpdateUserScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { user, updateUserName } = useUser()
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
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" translucent />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Edit Name</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleConfirm}
                    />
                </View>

                <View style={styles.bottomSection}>
                    <Pressable
                        style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
                        onPress={handleConfirm}
                        disabled={isLoading}
                    >
                        <Text style={styles.confirmButtonText}>
                            {isLoading ? 'Updating...' : 'Confirm'}
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
