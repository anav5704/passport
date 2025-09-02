import React, { useRef, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useUser } from '@/contexts'

interface BottomSheetsProps {
    currentCourse?: { id: number; code: string }
    onCourseSwitch?: (courseId: number) => void
}

export interface BottomSheetsRef {
    openUserSettings: () => void
    openCourseSwitcher: () => void
    openCourseManagement: () => void
}

const BottomSheets = forwardRef<BottomSheetsRef, BottomSheetsProps>(
    ({ currentCourse, onCourseSwitch }, ref) => {
        const { user } = useUser()

        // Bottom sheet refs
        const userSettingsSheetRef = useRef<BottomSheet>(null)
        const courseSwitcherSheetRef = useRef<BottomSheet>(null)
        const courseManagementSheetRef = useRef<BottomSheet>(null)

        // Bottom sheet snap points
        const userSettingsSnapPoints = useMemo(() => ['25%'], [])
        const courseSwitcherSnapPoints = useMemo(() => ['30%'], [])
        const courseManagementSnapPoints = useMemo(() => ['25%'], [])

        // Close other sheets when one opens
        const closeOtherSheets = (currentSheet: string) => {
            if (currentSheet !== 'userSettings') userSettingsSheetRef.current?.close()
            if (currentSheet !== 'courseSwitcher') courseSwitcherSheetRef.current?.close()
            if (currentSheet !== 'courseManagement') courseManagementSheetRef.current?.close()
        }

        // Expose methods to parent component
        useImperativeHandle(ref, () => ({
            openUserSettings: () => {
                closeOtherSheets('userSettings')
                userSettingsSheetRef.current?.expand()
            },
            openCourseSwitcher: () => {
                closeOtherSheets('courseSwitcher')
                courseSwitcherSheetRef.current?.expand()
            },
            openCourseManagement: () => {
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
                    snapPoints={userSettingsSnapPoints}
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    backgroundStyle={styles.bottomSheetBackground}
                    style={styles.bottomSheetContainer}
                >
                    <BottomSheetView style={styles.bottomSheetContent}>
                        <Text style={styles.bottomSheetTitle}>User Settings</Text>
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={styles.bottomSheetItemText}>Edit Name</Text>
                        </Pressable>
                    </BottomSheetView>
                </BottomSheet>

                {/* Course Switcher Bottom Sheet */}
                <BottomSheet
                    ref={courseSwitcherSheetRef}
                    index={-1}
                    snapPoints={courseSwitcherSnapPoints}
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    backgroundStyle={styles.bottomSheetBackground}
                    style={styles.bottomSheetContainer}
                >
                    <BottomSheetView style={styles.bottomSheetContent}>
                        <Text style={styles.bottomSheetTitle}>Switch Course</Text>
                        {user?.courses?.map((course) => (
                            <Pressable
                                key={course.id}
                                style={[
                                    styles.bottomSheetItem,
                                    currentCourse?.id === course.id && styles.activeItem
                                ]}
                                onPress={() => handleCourseSelect(course.id)}
                            >
                                <Text style={styles.bottomSheetItemText}>{course.code}</Text>
                                {currentCourse?.id === course.id && (
                                    <Ionicons name="checkmark" size={20} color="#009ca3" />
                                )}
                            </Pressable>
                        ))}
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={[styles.bottomSheetItemText, { color: '#009ca3' }]}>
                                Create New Course
                            </Text>
                        </Pressable>
                    </BottomSheetView>
                </BottomSheet>

                {/* Course Management Bottom Sheet */}
                <BottomSheet
                    ref={courseManagementSheetRef}
                    index={-1}
                    snapPoints={courseManagementSnapPoints}
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    backgroundStyle={styles.bottomSheetBackground}
                    style={styles.bottomSheetContainer}
                >
                    <BottomSheetView style={styles.bottomSheetContent}>
                        <Text style={styles.bottomSheetTitle}>Course Management</Text>
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={styles.bottomSheetItemText}>Export Attendance</Text>
                        </Pressable>
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={styles.bottomSheetItemText}>Edit Course</Text>
                        </Pressable>
                        <Pressable style={styles.bottomSheetItem}>
                            <Text style={[styles.bottomSheetItemText, { color: '#FF3B30' }]}>
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
        minHeight: 200,
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
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    bottomSheetItemText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    activeItem: {
        backgroundColor: '#F2F2F7',
        borderRadius: 8,
        marginHorizontal: -8,
    },
})

BottomSheets.displayName = 'BottomSheets'

export default BottomSheets
