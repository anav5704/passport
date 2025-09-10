import React from 'react'
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native'
import { ArrowLeft, Plus, Menu, ChevronDown } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from '@/contexts/UserContext'
import { useTheme } from '@/contexts/ThemeContext'
import { router } from 'expo-router'
import { COLORS, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/utils/designConstants'

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
        paddingLeft: SPACING.xl,
        paddingRight: SPACING.xl,
        paddingVertical: SPACING.lg,
        borderBottomWidth: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.primary, // Keep brand color for avatar
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: COLORS.white, // Keep white text on brand color background
        fontSize: FONT_SIZE.lg,
        fontWeight: FONT_WEIGHT.semibold,
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
        paddingHorizontal: SPACING.lg,
    },
    courseTitleText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.semibold,
        marginRight: SPACING.xs,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: BORDER_RADIUS.full,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    dropdownArrow: {
        marginLeft: SPACING.xs,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
    },
    titleText: {
        fontSize: FONT_SIZE.lg,
        fontWeight: FONT_WEIGHT.semibold,
    },
    menuButton: {
        width: 44,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: -4,
    },
})
