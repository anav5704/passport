import React, { createContext, useContext, useEffect, useState } from 'react'
import { getUserWithCourses, updateUserName as updateUserNameQuery } from '@database/queries'
import { Result } from '@/utils/types'

interface User {
    id: number
    name: string
    courses: { id: number; code: string; lastAccessed?: string | null }[]
}

interface UserContextType {
    user: User | null
    isLoading: boolean
    isOnboardingComplete: boolean
    refreshUser: () => Promise<void>
    updateUserName: (name: string) => Promise<Result<any>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)

    const refreshUser = async () => {
        try {
            setIsLoading(true)

            const userData = await getUserWithCourses()

            if (!userData) {
                setUser(null)
                setIsOnboardingComplete(false)
                return
            }

            setUser(userData)
            setIsOnboardingComplete(true)
        } catch (error) {
            setUser(null)
            setIsOnboardingComplete(false)
        } finally {
            setIsLoading(false)
        }
    }

    const updateUserName = async (name: string): Promise<Result<any>> => {
        if (!user) {
            return { ok: false, error: 'No user found' }
        }

        try {
            await updateUserNameQuery(user.id, name)
            await refreshUser() // Refresh to get updated data
            return { ok: true, value: undefined }
        } catch (error) {
            return { ok: false, error: 'Failed to update user name' }
        }
    }

    useEffect(() => {
        refreshUser()
    }, [])

    return (
        <UserContext.Provider
            value={{
                user,
                isLoading,
                isOnboardingComplete,
                refreshUser,
                updateUserName,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
