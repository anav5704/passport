import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as XLSX from 'xlsx'
import { useCourse } from '@/contexts/CourseContext'
import { useUser } from '@/contexts/UserContext'
import { getAttendanceHistoryForCourse } from '@/database/queries'
import Header from '@/components/Header'
import Button from '@/components/Button'

export default function AttendanceExportScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { user } = useUser()
    const insets = useSafeAreaInsets()
    const [courseName, setCourseName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [attendanceData, setAttendanceData] = useState<any[]>([])
    const [dateRange, setDateRange] = useState({ first: '', last: '' })

    useEffect(() => {
        const loadData = async () => {
            if (id && user?.courses) {
                const course = user.courses.find(c => c.id === parseInt(id))
                if (course) {
                    setCourseName(course.code)

                    // Load attendance data to get date range
                    try {
                        const attendance = await getAttendanceHistoryForCourse(parseInt(id))
                        setAttendanceData(attendance)

                        if (attendance.length > 0) {
                            const dates = attendance
                                .filter(a => a.timestamp)
                                .map(a => new Date(a.timestamp!))
                                .sort((a, b) => a.getTime() - b.getTime())

                            if (dates.length > 0) {
                                const firstDate = dates[0].toLocaleDateString('en-GB')
                                const lastDate = dates[dates.length - 1].toLocaleDateString('en-GB')
                                setDateRange({ first: firstDate, last: lastDate })
                            }
                        }
                    } catch (error) {
                        console.error('Error loading attendance data:', error)
                    }
                }
            }
        }

        loadData()
    }, [id, user?.courses])

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const ampm = hours >= 12 ? 'pm' : 'am'
        const displayHours = hours % 12 || 12
        const displayMinutes = minutes.toString().padStart(2, '0')
        return `${displayHours}:${displayMinutes} ${ampm}`
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-GB')
    }

    const generateExcel = () => {
        const data = attendanceData.map(attendance => ({
            'Course': courseName,
            'Leader': user?.name || '',
            'Date': formatDate(attendance.timestamp),
            'Time': formatTime(attendance.timestamp),
            'Student ID': attendance.studentId
        }))

        const worksheet = XLSX.utils.json_to_sheet(data)

        // Set column widths for better readability
        worksheet['!cols'] = [
            { wch: 15 },  // Course column
            { wch: 15 },  // Leader column
            { wch: 15 },  // Date column
            { wch: 15 },  // Time column
            { wch: 15 }   // Student ID column
        ]

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance')

        return XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' })
    }

    const handleExport = async () => {
        if (attendanceData.length === 0) {
            Alert.alert('No Data', 'There is no attendance data to export for this course.')
            return
        }

        setIsLoading(true)
        try {
            const excelData = generateExcel()
            const hyphenatedName = user?.name?.replace(/\s+/g, '-') || 'unknown'
            const fileName = `${courseName}-${hyphenatedName}.xlsx`
            const fileUri = `${FileSystem.documentDirectory}${fileName}`

            await FileSystem.writeAsStringAsync(fileUri, excelData, {
                encoding: FileSystem.EncodingType.Base64,
            })

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    dialogTitle: 'Export Attendance Data',
                })
            } else {
                Alert.alert('Export Complete', `File saved as: ${fileName}`)
            }
        } catch (error) {
            console.error('Export error:', error)
            Alert.alert('Error', 'Failed to export attendance data')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" translucent />

            <Header
                title="Attendance"
                showBackButton={true}
                showAvatar={false}
                showMenu={false}
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Text style={styles.infoText}>
                        {attendanceData.length > 0 ? (
                            `The export will contain attendances from ${dateRange.first} to ${dateRange.last}.`
                        ) : (
                            'No attendance data available for this course.'
                        )}
                    </Text>
                </View>

                <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 6 }]}>
                    <Button
                        title="Export"
                        onPress={handleExport}
                        disabled={isLoading || attendanceData.length === 0}
                        isLoading={isLoading}
                        loadingText="Exporting..."
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 0
    },
    topSection: {
        // paddingTop: 32,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'left',
        lineHeight: 24,
    },
    bottomSection: {
        // paddingBottom will be set dynamically using insets.bottom
    },
})
