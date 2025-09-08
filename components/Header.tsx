import React from 'react'
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native'
import { ArrowLeft, Plus, Menu, ChevronDown } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
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
    hasNoCourses?: boolean
}

export default function Header({
    currentCourse,
    onAvatarPress,
    onCourseTitlePress,
    onMenuPress,
    title,
    showBackButton = false,
    showAvatar = true,
    showMenu = true,
    hasNoCourses = false
}: HeaderProps) {
    const { user } = useUser()
    const { colors, themeMode } = useTheme()
    const insets = useSafeAreaInsets()

    // Get first letter of first name for avatar
    const getFirstLetter = (name: string) => {
        return name.trim().charAt(0).toUpperCase() || 'U'
    }

    const handleBackPress = () => {
        router.back()
    }

    const handleCreateCoursePress = () => {
        router.push('/course/create')
    }

    return (
        <View style={[styles.header, {
            paddingTop: insets.top + 16,
            backgroundColor: colors.background,
            borderBottomColor: colors.border
        }]}>
            {/* Left side - Avatar or Back Button */}
            {showBackButton ? (
                <Pressable style={styles.backButton} onPress={handleBackPress}>
                    <ArrowLeft size={24} color={colors.success} />
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
                    <Text style={[styles.titleText, { color: colors.text }]}>{title}</Text>
                </View>
            ) : hasNoCourses ? (
                <View style={styles.titleContainer}>
                    <Text style={[styles.titleText, { color: colors.text }]}>PASSport</Text>
                </View>
            ) : (
                <Pressable
                    style={[
                        styles.dropdownTrigger,
                        { backgroundColor: themeMode === 'dark' ? 'rgba(24, 24, 27, 1.0)' : 'rgba(244, 244, 245, 1.0)' }
                    ]}
                    onPress={onCourseTitlePress}
                >
                    <Text style={[styles.courseTitleText, { color: colors.text }]}>
                        {currentCourse?.code || 'Select Course'}
                    </Text>
                    <ChevronDown size={16} color={colors.text} style={styles.dropdownArrow} />
                </Pressable>
            )}

            {/* Right side - Menu or Create Course Button */}
            {showMenu ? (
                hasNoCourses ? (
                    <Pressable style={styles.menuButton} onPress={handleCreateCoursePress}>
                        <Plus size={24} color={themeMode === 'dark' ? '#ffffff' : '#000000'} />
                    </Pressable>
                ) : (
                    <Pressable style={styles.menuButton} onPress={onMenuPress}>
                        <Menu size={24} color={colors.text} />
                    </Pressable>
                )
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
        borderBottomWidth: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#009ca3', // Keep brand color for avatar
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff', // Keep white text on brand color background
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
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dropdownArrow: {
        marginLeft: 4,
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
    },
    menuButton: {
        width: 44,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: -4,
    },
})
