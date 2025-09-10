import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'

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
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f4f4f5',
    },
    attendanceItemWithMargin: {
        marginBottom: 20,
    },
    studentId: {
        fontSize: 16,
        fontWeight: '500',
    },
})
