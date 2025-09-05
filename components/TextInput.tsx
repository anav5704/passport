import React, { forwardRef } from 'react'
import { TextInput as RNTextInput, StyleSheet, TextInputProps } from 'react-native'

interface CustomTextInputProps extends TextInputProps {
    // You can add custom props here if needed in the future
}

const TextInput = forwardRef<RNTextInput, CustomTextInputProps>((props, ref) => {
    return (
        <RNTextInput
            {...props}
            ref={ref}
            style={[styles.input, props.style]}
        />
    )
})

TextInput.displayName = 'TextInput'

export default TextInput

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#f4f4f5', // zinc-100
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: '#fff',
    },
})
