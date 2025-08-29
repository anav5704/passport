import { StyleSheet, Text, View } from 'react-native'

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>PASS Attendance Tracker</Text>
            <Text style={styles.subText}>Database initialized successfully!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subText: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
})
