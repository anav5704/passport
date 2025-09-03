import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { StyleSheet } from 'react-native'
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
                backgroundStyle={styles.background}
                style={styles.container}
                handleIndicatorStyle={{ display: 'none' }}
            >
                <BottomSheetView style={[styles.content, { paddingBottom: insets.bottom }]}>
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
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: '#fff',
    },
})

BaseSheet.displayName = 'BaseSheet'

export default BaseSheet
