import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useUser } from '@/contexts'

export default function Index() {
    const { user, isLoading } = useUser()

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        )
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No user found</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, {user.name || 'User'}!</Text>
            <Text style={styles.subText}>PASSport</Text>

            <View style={styles.coursesContainer}>
                <Text style={styles.coursesTitle}>Your Course:</Text>
                {user.courses?.map((course) => (
                    <View key={course.id} style={styles.courseCard}>
                        <Text style={styles.courseCode}>{course.code || 'Unknown'}</Text>
                    </View>
                )) || null}
            </View>

            <Pressable style={styles.scanButton}>
                <Text style={styles.scanButtonText}>Start Scanning</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1a1a1a',
    },
    subText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#ff4444',
    },
    coursesContainer: {
        width: '100%',
        marginBottom: 32,
    },
    coursesTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
        color: '#1a1a1a',
    },
    courseCard: {
        backgroundColor: '#f0f9ff',
        borderWidth: 1,
        borderColor: '#0ea5e9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        alignItems: 'center',
    },
    courseCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0ea5e9',
    },
    scanButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    scanButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
})
