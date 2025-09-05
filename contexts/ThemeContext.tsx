import React, { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type ThemeMode = 'light' | 'dark' | 'system'
type ActualTheme = 'light' | 'dark'

interface ThemeContextType {
    themeMode: ThemeMode
    actualTheme: ActualTheme
    setThemeMode: (mode: ThemeMode) => Promise<void>
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

const THEME_STORAGE_KEY = '@theme_mode'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system')
    const systemColorScheme = useColorScheme()

    // Determine the actual theme based on mode and system preference
    const actualTheme: ActualTheme = themeMode === 'system'
        ? (systemColorScheme || 'light')
        : themeMode as ActualTheme

    const colors = actualTheme === 'dark' ? darkColors : lightColors

    // Load theme preference from storage on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
                if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
                    setThemeModeState(savedTheme as ThemeMode)
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error)
            }
        }
        loadTheme()
    }, [])

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
            setThemeModeState(mode)
        } catch (error) {
            console.error('Failed to save theme preference:', error)
            throw error
        }
    }

    const value: ThemeContextType = {
        themeMode,
        actualTheme,
        setThemeMode,
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
