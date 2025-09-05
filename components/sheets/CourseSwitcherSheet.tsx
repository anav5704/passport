import React, { forwardRef } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { router } from 'expo-router'
import { useUser } from '@/contexts/UserContext'
import { useCourse } from '@/contexts/CourseContext'
import { useSheet } from '@/contexts/SheetContext'
import { useTheme } from '@/contexts/ThemeContext'
import BaseSheet, { BaseSheetRef } from './BaseSheet'

const CourseSwitcherSheet = forwardRef<BaseSheetRef, {}>((props, ref) => {
    const { user } = useUser()
    const { currentCourse, setCourse } = useCourse()
    const { closeAllSheets } = useSheet()
    const { colors } = useTheme()

    // Function to parse course code and extract alphabets and digits for sorting
    const parseCourseCode = (courseCode: string) => {
        const match = courseCode.match(/^([A-Za-z]{2})(\d{3})/)
        if (match) {
            return {
                alphabets: match[1].toUpperCase(),
                digits: parseInt(match[2], 10)
            }
        }
        // Fallback for codes that don't match the expected pattern
        return {
            alphabets: courseCode.substring(0, 2).toUpperCase(),
            digits: 999 // Put non-matching codes at the end
        }
    }

    // Sort courses by alphabets first, then by digits
    const sortedCourses = user?.courses ? [...user.courses].sort((a, b) => {
        const parsedA = parseCourseCode(a.code)
        const parsedB = parseCourseCode(b.code)

        // First sort by alphabets
        if (parsedA.alphabets !== parsedB.alphabets) {
            return parsedA.alphabets.localeCompare(parsedB.alphabets)
        }

        // If alphabets are the same, sort by digits
        return parsedA.digits - parsedB.digits
    }) : []

    const handleCourseSelect = async (courseId: number) => {
        const course = user?.courses?.find(c => c.id === courseId)
        if (course) {
            await setCourse(course)
        }
        closeAllSheets()
    }

    const handleAddCourse = () => {
        closeAllSheets()
        router.push('/course/new')
    }

    return (
        <BaseSheet ref={ref}>
            <Text style={[styles.title, { color: colors.text }]}>Switch Course</Text>
            {sortedCourses.map((course) => (
                <Pressable
                    key={course.id}
                    style={styles.item}
                    onPress={() => handleCourseSelect(course.id)}
                >
                    <Text style={[
                        styles.itemText,
                        { color: colors.text },
                        currentCourse?.id === course.id && { color: colors.success }
                    ]}>
                        {course.code}
                    </Text>
                </Pressable>
            ))}
            <Pressable style={styles.item} onPress={handleAddCourse}>
                <Text style={[styles.itemText, { color: colors.text }]}>
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
        flex: 1,
    },
})

CourseSwitcherSheet.displayName = 'CourseSwitcherSheet'

export default CourseSwitcherSheet
