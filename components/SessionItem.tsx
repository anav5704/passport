import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { formatSessionTimestamp } from '@/utils/sessionUtils'
import { COLORS, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/utils/designConstants'

interface SessionHistoryItemProps {
    session: any
    index: number
    totalItems: number
    onPress: () => void
}

export default function SessionHistoryItem({ session, index, totalItems, onPress }: SessionHistoryItemProps) {
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            style={[
                styles.attendanceItem,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border
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
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    attendanceItemWithMargin: {
        marginBottom: SPACING.xl,
    },
    sessionInfo: {
        flex: 1,
    },
    studentId: {
        fontSize: FONT_SIZE.base,
        fontWeight: FONT_WEIGHT.semibold,
        color: COLORS.textDark,
        marginBottom: SPACING.xs,
    },
    attendanceCount: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.textMedium,
    },
})
