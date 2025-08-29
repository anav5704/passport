import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Text, View } from 'react-native'
import migrations from '@drizzle/migrations'
import { StatusBar } from 'expo-status-bar'
import 'react-native-gesture-handler'
import { Slot, useRouter, useSegments } from 'expo-router'
import { db } from '@database'
import { UserProvider, useUser } from '@/contexts'
import { useEffect } from 'react'

function RootLayoutNav() {
    const { user, isLoading, isOnboardingComplete } = useUser()
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

    return <Slot />
}

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations)

    if (error) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <Text style={styles.errorText}>Migration error: {error.message}</Text>
                <StatusBar style="auto" />
            </SafeAreaView>
        )
    }

    if (!success) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <Text style={styles.loadingText}>Migration is in progress...</Text>
                <StatusBar style="auto" />
            </SafeAreaView>
        )
    }

    return (
        <UserProvider>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <RootLayoutNav />
                <StatusBar style="auto" />
            </SafeAreaView>
        </UserProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
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
