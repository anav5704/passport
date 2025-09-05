import React, { createContext, useContext } from 'react'
import { useColorScheme } from 'react-native'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
    themeMode: ThemeMode
    colors: {
        background: string
        surface: string
        text: string
        textSecondary: string
        border: string
        primary: string
        danger: string
        success: string
    }
}

const lightColors = {
    background: '#ffffff',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    border: '#f4f4f5',
    primary: '#007AFF',
    danger: '#ff3b30',
    success: '#009ca3',
}

const darkColors = {
    background: '#000000',
    surface: '#111111',
    text: '#ffffff',
    textSecondary: '#999999',
    border: '#1a1a1a',
    primary: '#007AFF',
    danger: '#ff453a',
    success: '#00b8c2',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme()

    // Always follow system theme
    const themeMode: ThemeMode = systemColorScheme === 'dark' ? 'dark' : 'light'
    const colors = themeMode === 'dark' ? darkColors : lightColors

    const value: ThemeContextType = {
        themeMode,
        colors,
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
