import React from 'react'
import { StyleSheet, Text, View, Pressable, Platform, StatusBar } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from '@/contexts/UserContext'

interface HeaderProps {
    currentCourse?: { id: number; code: string }
    onAvatarPress?: () => void
    onCourseTitlePress?: () => void
    onMenuPress?: () => void
}

export default function Header({
    currentCourse,
    onAvatarPress,
    onCourseTitlePress,
    onMenuPress
}: HeaderProps) {
    const { user } = useUser()
    const insets = useSafeAreaInsets()

    // Get first letter of first name for avatar
    const getFirstLetter = (name: string) => {
        return name.trim().charAt(0).toUpperCase() || 'U'
    }

    return (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            {/* Avatar */}
            <Pressable style={styles.avatar} onPress={onAvatarPress}>
                <Text style={styles.avatarText}>
                    {user?.name ? getFirstLetter(user.name) : 'U'}
                </Text>
            </Pressable>

            {/* Course Title */}
            <Pressable style={styles.courseTitle} onPress={onCourseTitlePress}>
                <Text style={styles.courseTitleText}>
                    {currentCourse?.code || 'Select Course'}
                </Text>
            </Pressable>

            {/* Kebab menu */}
            <Pressable style={styles.menuButton} onPress={onMenuPress}>
                <Ionicons name="ellipsis-vertical" size={20} color="#333" />
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#009ca3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    courseTitle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    courseTitleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginRight: 4,
    },
    menuButton: {
        width: 44,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: -4,
    },
})
