import React, { forwardRef } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useUser } from '@/contexts/UserContext'
import BaseSheet, { BaseSheetRef } from './BaseSheet'

const GeneralSettingsSheet = forwardRef<BaseSheetRef, {}>((props, ref) => {
    const { user } = useUser()

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
        // TODO: Implement theme change navigation
        if (ref && 'current' in ref && ref.current) {
            ref.current.close()
        }
    }

    return (
        <BaseSheet ref={ref}>
            <Text style={styles.title}>General Settings</Text>
            <Pressable style={styles.item} onPress={handleEditName}>
                <Text style={styles.itemText}>Edit Name</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={handleChangeTheme}>
                <Text style={styles.itemText}>Change Theme</Text>
            </Pressable>
        </BaseSheet>
    )
})

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
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
        color: '#333',
        flex: 1,
    },
})

GeneralSettingsSheet.displayName = 'GeneralSettingsSheet'

export default GeneralSettingsSheet
