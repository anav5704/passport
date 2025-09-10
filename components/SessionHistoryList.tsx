import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/contexts/ThemeContext'
import SessionHistoryItem from '@/components/SessionHistoryItem'

interface SessionHistoryListProps {
    sessions: any[]
    onSessionPress: (sessionId: number) => void
}

export default function SessionHistoryList({ sessions, onSessionPress }: SessionHistoryListProps) {
    const { colors } = useTheme()
    const insets = useSafeAreaInsets()

    return (
        <FlashList
            data={sessions}
            keyExtractor={(item: any, index) => `session-${item.id}-${index}`}
            estimatedItemSize={100}
            renderItem={({ item, index }) => (
                <SessionHistoryItem
                    session={item}
                    index={index}
                    totalItems={sessions.length}
                    onPress={() => onSessionPress(item.id)}
                />
            )}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            showsVerticalScrollIndicator={false}
        />
    )
}

const styles = StyleSheet.create({
    // Styles moved to individual components
})
