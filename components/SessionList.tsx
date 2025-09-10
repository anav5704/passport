import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/contexts/ThemeContext'
import SessionItem from '@/components/SessionItem'

interface SessionListProps {
    sessions: any[]
    onSessionPress: (sessionId: number) => void
}

export default function SessionList({ sessions, onSessionPress }: SessionListProps) {
    const { colors } = useTheme()
    const insets = useSafeAreaInsets()

    return (
        <FlashList
            data={sessions}
            keyExtractor={(item: any, index) => `session-${item.id}-${index}`}
            estimatedItemSize={100}
            renderItem={({ item, index }) => (
                <SessionItem
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
