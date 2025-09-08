import React, { forwardRef } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { ArrowDownToLine, Edit, Trash } from 'lucide-react-native'
import { router } from 'expo-router'
import { useCourse } from '@/contexts/CourseContext'
import { useSheet } from '@/contexts/SheetContext'
import { useTheme } from '@/contexts/ThemeContext'
import BaseSheet, { BaseSheetRef } from './BaseSheet'

const CourseSettingsSheet = forwardRef<BaseSheetRef, {}>((props, ref) => {
    const { currentCourse } = useCourse()
    const { closeAllSheets } = useSheet()
    const { colors } = useTheme()

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

    const handleExportAttendance = () => {
        if (currentCourse) {
            closeAllSheets()
            router.push(`/course/${currentCourse.id}/attendance`)
        }
    }

    return (
        <BaseSheet ref={ref}>
            <Text style={[styles.title, { color: colors.text }]}>Course Settings</Text>
            <Pressable style={styles.item} onPress={handleExportAttendance}>
                <ArrowDownToLine size={24} color={colors.text} style={styles.icon} />
                <Text style={[styles.itemText, { color: colors.text }]}>Export Attendance</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={handleEditCourse}>
                <Edit size={24} color={colors.text} style={styles.icon} />
                <Text style={[styles.itemText, { color: colors.text }]}>Edit Course</Text>
            </Pressable>
            <Pressable style={styles.item} onPress={handleDeleteCourse}>
                <Trash size={24} color="#f43f5e" style={styles.icon} />
                <Text style={[styles.itemText, { color: '#f43f5e' }]}>
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
    icon: {
        marginRight: 12,
    },
})

CourseSettingsSheet.displayName = 'CourseSettingsSheet'

export default CourseSettingsSheet
