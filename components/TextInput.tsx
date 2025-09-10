import React, { forwardRef } from 'react'
import { TextInput as RNTextInput, StyleSheet, TextInputProps } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@/utils/designConstants'

interface CustomTextInputProps extends TextInputProps {
    // You can add custom props here if needed in the future
}

const TextInput = forwardRef<RNTextInput, CustomTextInputProps>((props, ref) => {
    const { colors } = useTheme()

    return (
        <RNTextInput
            {...props}
            ref={ref}
            style={[
                styles.input,
                {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    color: colors.text
                },
                props.style
            ]}
            placeholderTextColor={colors.textSecondary}
        />
    )
})

TextInput.displayName = 'TextInput'

export default TextInput

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZE.base,
    },
})
