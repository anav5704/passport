import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useCourse } from '@/contexts/CourseContext'
import { getSessionsWithAttendanceCount, getAttendanceHistoryForCourse, createSession as createSessionQuery } from '@/database/queries'
import { Result } from '@/utils/types'

interface SessionContextType {
    sessions: any[]
    sessionHistory: any[]
    isLoading: boolean
    createSession: () => Promise<Result<any>>
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
            setSessions([])
            setSessionHistory([])
        } finally {
            setIsLoading(false)
        }
    }

    const createSession = async (): Promise<Result<any>> => {
        if (!currentCourse) {
            return { ok: false, error: 'No current course selected' }
        }

        const result = await createSessionQuery(currentCourse.id)

        if (!result.ok) {
            return result
        }

        await refreshSessions() // Refresh data after creating session
        return result
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
