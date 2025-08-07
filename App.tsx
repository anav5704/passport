import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { StyleSheet, Text, View } from 'react-native'
import migrations from '@drizzle/migrations'
import { StatusBar } from 'expo-status-bar'
import { db } from '@database'

export default function App() {
    const { success, error } = useMigrations(db, migrations)

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Migration error: {error.message}</Text>
                <StatusBar style="auto" />
            </View>
        )
    }

    if (!success) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Migration is in progress...</Text>
                <StatusBar style="auto" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text>PASS Attendance Tracker</Text>
            <Text style={styles.subText}>Database initialized successfully!</Text>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    subText: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
})
