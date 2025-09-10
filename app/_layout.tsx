import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleSheet, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import migrations from '@drizzle/migrations'
import { StatusBar } from 'expo-status-bar'
import 'react-native-gesture-handler'
import { Slot, useRouter, useSegments } from 'expo-router'
import { db } from '@database'
import { UserProvider } from '@/contexts/UserContext'
import { CourseProvider } from '@/contexts/CourseContext'
import { SheetProvider } from '@/contexts/SheetContext'
import { SessionProvider } from '@/contexts/SessionContext'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { useUser } from '@/contexts/UserContext'
import { useEffect } from 'react'

function RootLayoutNav() {
    const { user, isLoading, isOnboardingComplete } = useUser()
    const { colors, themeMode } = useTheme()
    const insets = useSafeAreaInsets()
    const segments = useSegments()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return

        const inOnboarding = segments[0] === 'onboarding'

        if (!isOnboardingComplete && !inOnboarding) {
            router.replace('/onboarding')
        } else if (isOnboardingComplete && inOnboarding) {
            router.replace('/')
        }
    }, [isOnboardingComplete, isLoading, segments])

    return (
        <>
            <Slot />
            <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} translucent />
        </>
    )
}

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations)

    if (error) {
        return (
            <ThemeProvider>
                <ThemedErrorView error={error} />
            </ThemeProvider>
        )
    }

    if (!success) {
        return (
            <ThemeProvider>
                <ThemedLoadingView />
            </ThemeProvider>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <UserProvider>
                    <CourseProvider>
                        <SessionProvider>
                            <SheetProvider>
                                <SafeAreaView style={styles.container} edges={[]}>
                                    <RootLayoutNav />
                                </SafeAreaView>
                            </SheetProvider>
                        </SessionProvider>
                    </CourseProvider>
                </UserProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    )
}

function ThemedErrorView({ error }: { error: Error }) {
    const { colors, themeMode } = useTheme()
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={[]}>
            <Text style={[styles.errorText, { color: colors.danger }]}>
                Migration error: {error.message}
            </Text>
            <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} translucent />
        </SafeAreaView>
    )
}

function ThemedLoadingView() {
    const { colors, themeMode } = useTheme()
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={[]}>
            <Text style={[styles.loadingText, { color: colors.text }]}>
                Migration is in progress...
            </Text>
            <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} translucent />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
        flex: 1,
        textAlignVertical: 'center',
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
        flex: 1,
        textAlignVertical: 'center',
    },
})
