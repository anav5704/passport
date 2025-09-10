import React from 'react'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AttendanceItem from '@/components/AttendanceItem'

interface AttendanceListProps {
    attendanceData: any[]
}

export default function AttendanceList({ attendanceData }: AttendanceListProps) {
    const insets = useSafeAreaInsets()

    return (
        <FlashList
            data={attendanceData}
            keyExtractor={(item: any, index: number) => `attendance-${index}`}
            estimatedItemSize={50}
            renderItem={({ item, index }) => (
                <AttendanceItem
                    attendance={item}
                    index={index}
                    totalItems={attendanceData.length}
                />
            )}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            showsVerticalScrollIndicator={false}
        />
    )
}
