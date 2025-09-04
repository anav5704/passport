import React from 'react'
import { StyleSheet, Text, View, Pressable, Platform, StatusBar } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from '@/contexts/UserContext'
import { router } from 'expo-router'

interface HeaderProps {
    currentCourse?: { id: number; code: string }
    onAvatarPress?: () => void
    onCourseTitlePress?: () => void
    onMenuPress?: () => void
    title?: string
    showBackButton?: boolean
    showAvatar?: boolean
    showMenu?: boolean
}

export default function Header({
    currentCourse,
    onAvatarPress,
    onCourseTitlePress,
    onMenuPress,
    title,
    showBackButton = false,
    showAvatar = true,
    showMenu = true
}: HeaderProps) {
    const { user } = useUser()
    const insets = useSafeAreaInsets()

    // Get first letter of first name for avatar
    const getFirstLetter = (name: string) => {
        return name.trim().charAt(0).toUpperCase() || 'U'
    }

    const handleBackPress = () => {
        router.back()
    }

    return (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            {/* Left side - Avatar or Back Button */}
            {showBackButton ? (
                <Pressable style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>
            ) : showAvatar ? (
                <Pressable style={styles.avatar} onPress={onAvatarPress}>
                    <Text style={styles.avatarText}>
                        {user?.name ? getFirstLetter(user.name) : 'U'}
                    </Text>
                </Pressable>
            ) : (
                <View style={styles.spacer} />
            )}

            {/* Center - Course Title or Custom Title */}
            {title ? (
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
            ) : (
                <Pressable style={styles.courseTitle} onPress={onCourseTitlePress}>
                    <Text style={styles.courseTitleText}>
                        {currentCourse?.code || 'Select Course'}
                    </Text>
                </Pressable>
            )}

            {/* Right side - Menu or Spacer */}
            {showMenu ? (
                <Pressable style={styles.menuButton} onPress={onMenuPress}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#333" />
                </Pressable>
            ) : (
                <View style={styles.spacer} />
            )}
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
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f5', // zinc-100 equivalent
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
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spacer: {
        width: 40,
        height: 40,
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
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    menuButton: {
        width: 44,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: -4,
    },
})
