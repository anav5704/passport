import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from './UserContext'
import { createCourse, updateCourse, deleteCourse } from '@/database/queries'

interface Course {
    id: number
    code: string
}

interface CourseContextType {
    currentCourse: Course | null
    setCourse: (course: Course) => void
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

    // Set the first course as default when user loads
    useEffect(() => {
        if (user?.courses && user.courses.length > 0 && !currentCourse) {
            setCurrentCourse(user.courses[0])
        }
    }, [user, currentCourse])

    const setCourse = (course: Course) => {
        setCurrentCourse(course)
    }

    const clearCourse = () => {
        setCurrentCourse(null)
    }

    const addCourse = async (code: string) => {
        if (!user) throw new Error('No user found')
        await createCourse(code, user.id)
        await refreshUser()
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
