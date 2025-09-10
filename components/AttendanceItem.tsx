import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { COLORS, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/utils/designConstants'

interface AttendanceItemProps {
    attendance: any
    index: number
    totalItems: number
}

export default function AttendanceItem({ attendance, index, totalItems }: AttendanceItemProps) {
    const { colors } = useTheme()

    return (
        <View style={[
            styles.attendanceItem,
            { backgroundColor: colors.surface, borderColor: colors.border },
            index < totalItems - 1 && styles.attendanceItemWithMargin
        ]}>
            <Text style={[styles.studentId, { color: colors.text }]}>
                {attendance.studentId}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    attendanceItem: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    attendanceItemWithMargin: {
        marginBottom: SPACING.xl,
    },
    studentId: {
        fontSize: FONT_SIZE.base,
        fontWeight: FONT_WEIGHT.medium,
    },
})
