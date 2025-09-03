import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from './UserContext'

interface Course {
    id: number
    code: string
}

interface CourseContextType {
    currentCourse: Course | null
    setCourse: (course: Course) => void
    clearCourse: () => void
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

interface CourseProviderProps {
    children: ReactNode
}

export function CourseProvider({ children }: CourseProviderProps) {
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null)
    const { user } = useUser()

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

    return (
        <CourseContext.Provider
            value={{
                currentCourse,
                setCourse,
                clearCourse,
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
