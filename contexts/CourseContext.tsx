import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from './UserContext'
import { createCourse, updateCourse, deleteCourse, updateCourseLastAccessed, getMostRecentlyAccessedCourse } from '@/database/queries'

interface Course {
    id: number
    code: string
    lastAccessed?: string | null
}

interface CourseContextType {
    currentCourse: Course | null
    setCourse: (course: Course) => Promise<void>
    clearCourse: () => void
    addCourse: (code: string) => Promise<void>
    updateCourseCode: (courseId: number, code: string) => Promise<void>
    removeCourse: (courseId: number) => Promise<void>
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

interface CourseProviderProps {
    children: ReactNode
}

export function CourseProvider({ children }: CourseProviderProps) {
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null)
    const { user, refreshUser } = useUser()

    // Set the most recently accessed course as default when user loads
    useEffect(() => {
        const setInitialCourse = async () => {
            if (user?.courses && user.courses.length > 0 && !currentCourse) {
                try {
                    const mostRecentCourse = await getMostRecentlyAccessedCourse(user.id)
                    if (mostRecentCourse) {
                        // Find the course in user.courses to get the full course object
                        const courseWithData = user.courses.find(c => c.id === mostRecentCourse.id)
                        if (courseWithData) {
                            setCurrentCourse(courseWithData)
                            // Don't call setCourse here to avoid updating lastAccessed on app load
                        }
                    }
                } catch (error) {
                    console.error('Error setting initial course:', error)
                    // Fallback to first course if there's an error
                    setCurrentCourse(user.courses[0])
                }
            }
        }

        setInitialCourse()
    }, [user, currentCourse])

    const setCourse = async (course: Course) => {
        setCurrentCourse(course)
        try {
            await updateCourseLastAccessed(course.id)
        } catch (error) {
            console.error('Error updating course last accessed:', error)
        }
    }

    const clearCourse = () => {
        setCurrentCourse(null)
    }

    const addCourse = async (code: string) => {
        if (!user) throw new Error('No user found')
        const newCourse = await createCourse(code, user.id)
        await updateCourseLastAccessed(newCourse.id)
        await refreshUser()

        // Set the newly created course as the current course
        const courseWithData = {
            id: newCourse.id,
            code: newCourse.code,
            lastAccessed: new Date().toISOString()
        }
        setCurrentCourse(courseWithData)
    }

    const updateCourseCode = async (courseId: number, code: string) => {
        await updateCourse(courseId, code)
        await refreshUser()
        // Update current course if it's the one being updated
        if (currentCourse?.id === courseId) {
            setCurrentCourse({ ...currentCourse, code })
        }
    }

    const removeCourse = async (courseId: number) => {
        await deleteCourse(courseId)
        await refreshUser()
        // Clear current course if it's the one being deleted
        if (currentCourse?.id === courseId) {
            clearCourse()
        }
    }

    return (
        <CourseContext.Provider
            value={{
                currentCourse,
                setCourse,
                clearCourse,
                addCourse,
                updateCourseCode,
                removeCourse,
            }}
        >
            {children}
        </CourseContext.Provider>
    )
}

export function useCourse() {
    const context = useContext(CourseContext)
    if (context === undefined) {
        throw new Error('useCourse must be used within a CourseProvider')
    }
    return context
}
