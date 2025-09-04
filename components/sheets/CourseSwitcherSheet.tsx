import React, { forwardRef } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useUser } from '@/contexts/UserContext'
import { useCourse } from '@/contexts/CourseContext'
import { useSheet } from '@/contexts/SheetContext'
import BaseSheet, { BaseSheetRef } from './BaseSheet'

const CourseSwitcherSheet = forwardRef<BaseSheetRef, {}>((props, ref) => {
    const { user } = useUser()
    const { currentCourse, setCourse } = useCourse()
    const { closeAllSheets } = useSheet()

    const handleCourseSelect = (courseId: number) => {
        const course = user?.courses?.find(c => c.id === courseId)
        if (course) {
            setCourse(course)
        }
        closeAllSheets()
    }

    const handleAddCourse = () => {
        closeAllSheets()
        router.push('/course/new')
    }

    return (
        <BaseSheet ref={ref}>
            <Text style={styles.title}>Switch Course</Text>
            {user?.courses?.map((course) => (
                <Pressable
                    key={course.id}
                    style={styles.item}
                    onPress={() => handleCourseSelect(course.id)}
                >
                    <Text style={[
                        styles.itemText,
                        currentCourse?.id === course.id && { color: '#009ca3' }
                    ]}>
                        {course.code}
                    </Text>
                </Pressable>
            ))}
            <Pressable style={styles.item} onPress={handleAddCourse}>
                <Text style={styles.itemText}>
                    Add Course
                </Text>
            </Pressable>
        </BaseSheet>
    )
})

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
})

CourseSwitcherSheet.displayName = 'CourseSwitcherSheet'

export default CourseSwitcherSheet
