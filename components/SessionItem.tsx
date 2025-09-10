import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { formatSessionTimestamp } from '@/utils/sessionUtils'

interface SessionHistoryItemProps {
    session: any
    index: number
    totalItems: number
    onPress: () => void
}

export default function SessionHistoryItem({ session, index, totalItems, onPress }: SessionHistoryItemProps) {
    const { colors } = useTheme()

    const isSessionActive = (timestamp: string) => {
        const sessionTime = new Date(timestamp)
        const now = new Date()

        // Check if it's the same day
        const isSameDay = sessionTime.toDateString() === now.toDateString()

        if (!isSameDay) return false

        // Check if current time is within the same hour as session start
        const sessionHour = sessionTime.getHours()
        const currentHour = now.getHours()

        return sessionHour === currentHour
    }

    const isActive = isSessionActive(session.timestamp)

    return (
        <TouchableOpacity
            style={[
                styles.attendanceItem,
                {
                    backgroundColor: colors.surface,
                    borderColor: isActive ? '#009ca3' : colors.border
                },
                index < totalItems - 1 && styles.attendanceItemWithMargin
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.sessionInfo}>
                <Text style={[styles.studentId, { color: colors.text }]}>
                    {formatSessionTimestamp(session.timestamp)}
                </Text>
                <Text style={[styles.attendanceCount, { color: colors.textSecondary }]}>
                    {session.attendanceCount || 0} student{(session.attendanceCount || 0) !== 1 ? 's' : ''} attended
                </Text>
            </View>
        </TouchableOpacity>
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
    sessionInfo: {
        flex: 1,
    },
    studentId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    attendanceCount: {
        fontSize: 14,
        color: '#666',
    },
})
