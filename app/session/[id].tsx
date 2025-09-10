import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useTheme } from '@/contexts/ThemeContext'
import { getSessionById, getAttendanceForSession } from '@/database/queries'
import Header from '@/components/Header'

export default function SessionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { colors } = useTheme()
    const insets = useSafeAreaInsets()
    const [session, setSession] = useState<any>(null)
    const [attendanceData, setAttendanceData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const loadSessionData = async () => {
            if (!id) return

            try {
                setIsLoading(true)

                // Get session details
                const sessionData = await getSessionById(parseInt(id))
                setSession(sessionData)

                // Get attendance for this session
                const attendance = await getAttendanceForSession(parseInt(id))
                setAttendanceData(attendance)

            } catch (error) {
                console.error('Error loading session data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadSessionData()
    }, [id])

    const formatSessionTime = (timestamp: string) => {
        const date = new Date(timestamp)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const day = days[date.getDay()]
        const dayOfMonth = date.getDate()
        const month = months[date.getMonth()]
        const hours24 = date.getHours()
        const ampm = hours24 >= 12 ? 'pm' : 'am'
        const displayHours = hours24 === 0 ? 12 : (hours24 > 12 ? hours24 - 12 : hours24)
        return `${day} ${dayOfMonth} ${month}, ${displayHours}${ampm}`
    }

    if (!session && !isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header
                    title="Session Details"
                    showBackButton={true}
                    showAvatar={false}
                    showMenu={false}
                />
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>
                        Session not found
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
                title={session ? formatSessionTime(session.timestamp) : "Session Details"}
                showBackButton={true}
                showAvatar={false}
                showMenu={false}
            />

            <View style={[styles.content, { paddingBottom: insets.bottom }]}>
                <View style={styles.summaryContainer}>
                    <Text style={[styles.summaryText, { color: colors.text }]}>
                        {attendanceData.length} student{attendanceData.length !== 1 ? 's' : ''} attended
                    </Text>
                </View>

                {attendanceData.length > 0 ? (
                    <FlashList
                        data={attendanceData}
                        keyExtractor={(item: any, index: number) => `attendance-${index}`}
                        estimatedItemSize={50}
                        renderItem={({ item, index }) => (
                            <View style={[
                                styles.attendanceItem,
                                { backgroundColor: colors.surface, borderColor: colors.border },
                                index < attendanceData.length - 1 && styles.attendanceItemWithMargin
                            ]}>
                                <Text style={[styles.studentId, { color: colors.text }]}>
                                    {item.studentId}
                                </Text>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: insets.bottom }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingBottom: 0,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
    },
    summaryContainer: {
        paddingBottom: 20,
    },
    summaryText: {
        fontSize: 16,
        fontWeight: '500',
    },
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
