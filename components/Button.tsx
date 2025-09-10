import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
import { COLORS, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING, OPACITY } from '@/utils/designConstants'

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
        borderRadius: BORDER_RADIUS.full,
        paddingVertical: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    dangerButton: {
        backgroundColor: COLORS.danger,
    },
    buttonDisabled: {
        opacity: OPACITY.disabled,
    },
    buttonText: {
        fontSize: FONT_SIZE.base,
        fontWeight: FONT_WEIGHT.semibold,
    },
    primaryButtonText: {
        color: COLORS.white,
    },
    dangerButtonText: {
        color: COLORS.white,
    },
})
