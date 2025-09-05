import React, { forwardRef } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import BaseSheet, { BaseSheetRef } from './BaseSheet'

const GeneralSettingsSheet = forwardRef<BaseSheetRef, {}>((props, ref) => {
    const { user } = useUser()
    const { colors } = useTheme()

    const handleEditName = () => {
        if (!user) {
            return
        }

        // Close the sheet first, then navigate
        if (ref && 'current' in ref && ref.current) {
            ref.current.close()
        }
        router.push(`/user/${user.id}/update`)
    }

    const handleChangeTheme = () => {
        // Close the sheet first, then navigate to theme screen
        if (ref && 'current' in ref && ref.current) {
            ref.current.close()
        }
        router.push('/theme')
    }

    return (
        <BaseSheet ref={ref}>
            <Text style={[styles.title, { color: colors.text }]}>General Settings</Text>
            <Pressable style={styles.item} onPress={handleEditName}>
                <Text style={[styles.itemText, { color: colors.text }]}>Edit Name</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={handleChangeTheme}>
                <Text style={[styles.itemText, { color: colors.text }]}>Change Theme</Text>
            </Pressable>
        </BaseSheet>
    )
})

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    itemText: {
        fontSize: 16,
        flex: 1,
    },
})

GeneralSettingsSheet.displayName = 'GeneralSettingsSheet'

export default GeneralSettingsSheet
