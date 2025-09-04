import React, { forwardRef } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useCourse } from '@/contexts/CourseContext'
import { useSheet } from '@/contexts/SheetContext'
import BaseSheet, { BaseSheetRef } from './BaseSheet'

const CourseSettingsSheet = forwardRef<BaseSheetRef, {}>((props, ref) => {
    const { currentCourse } = useCourse()
    const { closeAllSheets } = useSheet()

    const handleEditCourse = () => {
        if (currentCourse) {
            closeAllSheets()
            router.push(`/course/${currentCourse.id}/update`)
        }
    }

    const handleDeleteCourse = () => {
        if (currentCourse) {
            closeAllSheets()
            router.push(`/course/${currentCourse.id}/delete`)
        }
    }

    return (
        <BaseSheet ref={ref}>
            <Text style={styles.title}>Course Settings</Text>
            <Pressable style={styles.item}>
                <Text style={styles.itemText}>Export Attendance</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={handleEditCourse}>
                <Text style={styles.itemText}>Edit Course</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={handleDeleteCourse}>
                <Text style={[styles.itemText, { color: '#F43F5E' }]}>
                    Delete Course
                </Text>
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

CourseSettingsSheet.displayName = 'CourseSettingsSheet'

export default CourseSettingsSheet
