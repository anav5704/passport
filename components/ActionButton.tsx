import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'

interface ButtonProps {
    title: string
    onPress: () => void
    disabled?: boolean
    variant?: 'primary' | 'danger'
    isLoading?: boolean
    loadingText?: string
}

export default function Button({
    title,
    onPress,
    disabled = false,
    variant = 'primary',
    isLoading = false,
    loadingText
}: ButtonProps) {
    const buttonStyle = [
        styles.button,
        variant === 'danger' ? styles.dangerButton : styles.primaryButton,
        (disabled || isLoading) && styles.buttonDisabled
    ]

    const textStyle = [
        styles.buttonText,
        variant === 'danger' ? styles.dangerButtonText : styles.primaryButtonText
    ]

    return (
        <Pressable
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || isLoading}
        >
            <Text style={textStyle}>
                {isLoading && loadingText ? loadingText : title}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 9999, // This creates the pill shape (rounded-full equivalent)
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#009ca3',
    },
    dangerButton: {
        backgroundColor: '#F43F5E',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryButtonText: {
        color: '#fff',
    },
    dangerButtonText: {
        color: '#fff',
    },
})
