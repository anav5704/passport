import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useCourse } from '@/contexts/CourseContext'
import { getSessionsWithAttendanceCount, getAttendanceHistoryForCourse, createSession as createSessionQuery } from '@/database/queries'

interface SessionContextType {
    sessions: any[]
    sessionHistory: any[]
    isLoading: boolean
    createSession: () => Promise<any>
    refreshSessions: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionProviderProps {
    children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
    const { currentCourse } = useCourse()
    const [sessions, setSessions] = useState<any[]>([])
    const [sessionHistory, setSessionHistory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const refreshSessions = async () => {
        if (!currentCourse) {
            setSessions([])
            setSessionHistory([])
            return
        }

        try {
            setIsLoading(true)

            const [sessionsData, historyData] = await Promise.all([
                getSessionsWithAttendanceCount(currentCourse.id),
                getAttendanceHistoryForCourse(currentCourse.id)
            ])

            setSessions(sessionsData)
            setSessionHistory(historyData)
        } catch (error) {
            console.error('Error fetching session data:', error)
            setSessions([])
            setSessionHistory([])
        } finally {
            setIsLoading(false)
        }
    }

    const createSession = async () => {
        if (!currentCourse) {
            throw new Error('No current course selected')
        }

        try {
            const newSession = await createSessionQuery(currentCourse.id)
            await refreshSessions() // Refresh data after creating session
            return newSession
        } catch (error) {
            console.error('Error creating session:', error)
            throw error
        }
    }

    useEffect(() => {
        refreshSessions()
    }, [currentCourse])

    return (
        <SessionContext.Provider
            value={{
                sessions,
                sessionHistory,
                isLoading,
                createSession,
                refreshSessions,
            }}
        >
            {children}
        </SessionContext.Provider>
    )
}

export function useSession() {
    const context = useContext(SessionContext)
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider')
    }
    return context
}
