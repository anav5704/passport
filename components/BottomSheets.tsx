import React, { useRef, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from '@/contexts'

interface BottomSheetsProps {
    currentCourse?: { id: number; code: string }
    onCourseSwitch?: (courseId: number) => void
}

export interface BottomSheetsRef {
    openAppSettings: () => void
    openCourseSwitcher: () => void
    openCourseSettings: () => void
}

const BottomSheets = forwardRef<BottomSheetsRef, BottomSheetsProps>(
    ({ currentCourse, onCourseSwitch }, ref) => {
        const { user } = useUser()
        const insets = useSafeAreaInsets()

        // Bottom sheet refs
        const userSettingsSheetRef = useRef<BottomSheet>(null)
        const courseSwitcherSheetRef = useRef<BottomSheet>(null)
        const courseManagementSheetRef = useRef<BottomSheet>(null)

        // Close other sheets when one opens
        const closeOtherSheets = (currentSheet: string) => {
            if (currentSheet !== 'userSettings') userSettingsSheetRef.current?.close()
            if (currentSheet !== 'courseSwitcher') courseSwitcherSheetRef.current?.close()
            if (currentSheet !== 'courseManagement') courseManagementSheetRef.current?.close()
        }

        // Expose methods to parent component
        useImperativeHandle(ref, () => ({
            openAppSettings: () => {
                closeOtherSheets('userSettings')
                userSettingsSheetRef.current?.expand()
            },
            openCourseSwitcher: () => {
                closeOtherSheets('courseSwitcher')
                courseSwitcherSheetRef.current?.expand()
            },
            openCourseSettings: () => {
                closeOtherSheets('courseManagement')
                courseManagementSheetRef.current?.expand()
            },
        }))

        const handleCourseSelect = (courseId: number) => {
            onCourseSwitch?.(courseId)
            courseSwitcherSheetRef.current?.close()
        }

        // Backdrop component for overlay
        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    opacity={0.5}
                />
            ),
            []
        )

        return (
            <>
                {/* User Settings Bottom Sheet */}
                <BottomSheet
                    ref={userSettingsSheetRef}
                    index={-1}
                    enableDynamicSizing
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    backgroundStyle={styles.bottomSheetBackground}
                    style={styles.bottomSheetContainer}
                    handleIndicatorStyle={{ display: 'none' }}
                >
                    <BottomSheetView style={[styles.bottomSheetContent, { paddingBottom: insets.bottom }]}>
                        <Text style={styles.bottomSheetTitle}>General Settings</Text>
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={styles.bottomSheetItemText}>Edit Name</Text>
                        </Pressable>
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={styles.bottomSheetItemText}>Change Theme</Text>
                        </Pressable>
                    </BottomSheetView>
                </BottomSheet>

                {/* Course Switcher Bottom Sheet */}
                <BottomSheet
                    ref={courseSwitcherSheetRef}
                    index={-1}
                    enableDynamicSizing
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    backgroundStyle={styles.bottomSheetBackground}
                    style={styles.bottomSheetContainer}
                    handleIndicatorStyle={{ display: 'none' }}
                >
                    <BottomSheetView style={[styles.bottomSheetContent, { paddingBottom: insets.bottom }]}>
                        <Text style={styles.bottomSheetTitle}>Switch Course</Text>
                        {user?.courses?.map((course) => (
                            <Pressable
                                key={course.id}
                                style={styles.bottomSheetItem}
                                onPress={() => handleCourseSelect(course.id)}
                            >
                                <Text style={[
                                    styles.bottomSheetItemText,
                                    currentCourse?.id === course.id && { color: '#009ca3' }
                                ]}>
                                    {course.code}
                                </Text>
                            </Pressable>
                        ))}
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={styles.bottomSheetItemText}>
                                Add Course
                            </Text>
                        </Pressable>
                    </BottomSheetView>
                </BottomSheet>

                {/* Course Settings Bottom Sheet */}
                <BottomSheet
                    ref={courseManagementSheetRef}
                    index={-1}
                    enableDynamicSizing
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    backgroundStyle={styles.bottomSheetBackground}
                    style={styles.bottomSheetContainer}
                    handleIndicatorStyle={{ display: 'none' }}
                >
                    <BottomSheetView style={[styles.bottomSheetContent, { paddingBottom: insets.bottom }]}>
                        <Text style={styles.bottomSheetTitle}>Course Settings</Text>
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={styles.bottomSheetItemText}>Export Attendance</Text>
                        </Pressable>
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={styles.bottomSheetItemText}>Edit Course</Text>
                        </Pressable>
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={[styles.bottomSheetItemText, { color: '#F43F5E' }]}>
                                Delete Course
                            </Text>
                        </Pressable>
                    </BottomSheetView>
                </BottomSheet>
            </>
        )
    }
)

const styles = StyleSheet.create({
    bottomSheetContainer: {
        zIndex: 999999,
        elevation: 999999,
    },
    bottomSheetBackground: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomSheetContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    bottomSheetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    bottomSheetItemText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
})

BottomSheets.displayName = 'BottomSheets'

export default BottomSheets
