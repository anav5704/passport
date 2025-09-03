import React, { createContext, useContext, useRef, ReactNode } from 'react'
import { BaseSheetRef } from '@/components/sheets/BaseSheet'

interface SheetContextType {
    generalSettingsRef: React.RefObject<BaseSheetRef | null>
    courseSwitcherRef: React.RefObject<BaseSheetRef | null>
    courseSettingsRef: React.RefObject<BaseSheetRef | null>
    openGeneralSettings: () => void
    openCourseSwitcher: () => void
    openCourseSettings: () => void
    closeAllSheets: () => void
}

const SheetContext = createContext<SheetContextType | undefined>(undefined)

interface SheetProviderProps {
    children: ReactNode
}

export function SheetProvider({ children }: SheetProviderProps) {
    // Sheet refs
    const generalSettingsRef = useRef<BaseSheetRef>(null)
    const courseSwitcherRef = useRef<BaseSheetRef>(null)
    const courseSettingsRef = useRef<BaseSheetRef>(null)

    // Sheet control functions
    const openGeneralSettings = () => {
        generalSettingsRef.current?.expand()
    }

    const openCourseSwitcher = () => {
        courseSwitcherRef.current?.expand()
    }

    const openCourseSettings = () => {
        courseSettingsRef.current?.expand()
    }

    const closeAllSheets = () => {
        generalSettingsRef.current?.close()
        courseSwitcherRef.current?.close()
        courseSettingsRef.current?.close()
    }

    return (
        <SheetContext.Provider
            value={{
                generalSettingsRef,
                courseSwitcherRef,
                courseSettingsRef,
                openGeneralSettings,
                openCourseSwitcher,
                openCourseSettings,
                closeAllSheets,
            }}
        >
            {children}
        </SheetContext.Provider>
    )
}

export function useSheet() {
    const context = useContext(SheetContext)
    if (context === undefined) {
        throw new Error('useSheet must be used within a SheetProvider')
    }
    return context
}
