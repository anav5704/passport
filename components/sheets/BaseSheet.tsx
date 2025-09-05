import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { StyleSheet } from 'react-native'
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/contexts/ThemeContext'

export interface BaseSheetRef {
    expand: () => void
    close: () => void
}

interface BaseSheetProps {
    children: React.ReactNode
}

const BaseSheet = forwardRef<BaseSheetRef, BaseSheetProps>(
    ({ children }, ref) => {
        const insets = useSafeAreaInsets()
        const { colors } = useTheme()
        const bottomSheetRef = useRef<BottomSheet>(null)

        useImperativeHandle(ref, () => ({
            expand: () => bottomSheetRef.current?.expand(),
            close: () => bottomSheetRef.current?.close(),
        }))

        const renderBackdrop = (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
            />
        )

        return (
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                enableDynamicSizing
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                backgroundStyle={[styles.background, { backgroundColor: colors.surface }]}
                style={styles.container}
                handleIndicatorStyle={{ display: 'none' }}
            >
                <BottomSheetView style={[
                    styles.content,
                    {
                        paddingBottom: insets.bottom,
                        backgroundColor: colors.surface
                    }
                ]}>
                    {children}
                </BottomSheetView>
            </BottomSheet>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        zIndex: 999999,
        elevation: 999999,
    },
    background: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
})

BaseSheet.displayName = 'BaseSheet'

export default BaseSheet
