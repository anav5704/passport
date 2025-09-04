import { users, courses, students, attendance } from "@database/schema";
import { eq, and } from "drizzle-orm";
import { db } from "@database";

// User queries
export const getAllUsers = async () => {
    return await db.select().from(users);
};

export const createUser = async (name: string) => {
    const [user] = await db
        .insert(users)
        .values({
            name: name.trim(),
        })
        .returning();
    return user;
};

export const updateUserName = async (userId: number, name: string) => {
    const [updatedUser] = await db
        .update(users)
        .set({ name: name.trim() })
        .where(eq(users.id, userId))
        .returning();
    return updatedUser;
};

// Course queries
export const createCourse = async (code: string, leaderId: number) => {
    const [course] = await db
        .insert(courses)
        .values({
            code: code.trim(),
            leaderId,
        })
        .returning();
    return course;
};

export const getCoursesByLeaderId = async (leaderId: number) => {
    return await db
        .select()
        .from(courses)
        .where(eq(courses.leaderId, leaderId));
};

export const updateCourse = async (courseId: number, code: string) => {
    const [updatedCourse] = await db
        .update(courses)
        .set({ code: code.trim() })
        .where(eq(courses.id, courseId))
        .returning();
    return updatedCourse;
};

export const deleteCourse = async (courseId: number) => {
    await db.delete(courses).where(eq(courses.id, courseId));
};

export const getCourseById = async (courseId: number) => {
    const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));
    return course;
};

export const updateCourseLastAccessed = async (courseId: number) => {
    const timestamp = new Date().toISOString();
    await db
        .update(courses)
        .set({ lastAccessed: timestamp })
        .where(eq(courses.id, courseId));
};

export const getMostRecentlyAccessedCourse = async (leaderId: number) => {
    const userCourses = await getCoursesByLeaderId(leaderId);

    if (userCourses.length === 0) {
        return null;
    }

    // Filter courses that have lastAccessed and sort by most recent
    const coursesWithAccess = userCourses.filter(
        (course) => course.lastAccessed
    );

    if (coursesWithAccess.length === 0) {
        // If no courses have been accessed yet, return the first course
        return userCourses[0];
    }

    // Sort by lastAccessed in descending order (most recent first)
    coursesWithAccess.sort((a, b) => {
        const dateA = new Date(a.lastAccessed!);
        const dateB = new Date(b.lastAccessed!);
        return dateB.getTime() - dateA.getTime();
    });

    return coursesWithAccess[0];
};

// Combined queries
export const setupUserWithCourse = async (name: string, courseCode: string) => {
    try {
        // Insert user
        const user = await createUser(name);

        // Insert course
        const course = await createCourse(courseCode, user.id);

        // Set the course as accessed (since it's the user's first course)
        await updateCourseLastAccessed(course.id);

        return user;
    } catch (error) {
        console.error("Error setting up user:", error);
        throw error;
    }
};

export const getUserWithCourses = async () => {
    try {
        // Check if there are any users in the database
        const allUsers = await getAllUsers();

        if (allUsers.length === 0) {
            return null;
        }

        // For now, get the first user (single user app)
        const currentUser = allUsers[0];

        // Get user's courses
        const userCourses = await getCoursesByLeaderId(currentUser.id);

        return {
            id: currentUser.id,
            name: currentUser.name,
            courses: userCourses.map((course) => ({
                id: course.id,
                code: course.code,
                lastAccessed: course.lastAccessed,
            })),
        };
    } catch (error) {
        console.error("Error loading user:", error);
        throw error;
    }
};

// Student queries
export const getStudentByStudentId = async (studentId: string) => {
    const [student] = await db
        .select()
        .from(students)
        .where(eq(students.studentId, studentId));
    return student;
};

export const createStudent = async (studentId: string, signature: string) => {
    const [student] = await db
        .insert(students)
        .values({
            studentId: studentId.trim(),
            studentSignature: signature.trim(),
        })
        .returning();
    return student;
};

export const updateStudentSignature = async (
    studentId: string,
    signature: string
) => {
    const [updatedStudent] = await db
        .update(students)
        .set({ studentSignature: signature.trim() })
        .where(eq(students.studentId, studentId))
        .returning();
    return updatedStudent;
};

// Attendance queries
export const logAttendance = async (studentId: number, courseId: number) => {
    const [attendanceRecord] = await db
        .insert(attendance)
        .values({
            studentId,
            courseId,
        })
        .returning();
    return attendanceRecord;
};

export const getAttendanceByStudentAndCourse = async (
    studentId: number,
    courseId: number
) => {
    return await db
        .select()
        .from(attendance)
        .where(
            and(
                eq(attendance.studentId, studentId),
                eq(attendance.courseId, courseId)
            )
        );
};

export const getAttendanceHistoryForCourse = async (courseId: number) => {
    return await db
        .select({
            attendanceId: attendance.attendanceId,
            studentId: students.studentId,
            timestamp: attendance.timestamp,
        })
        .from(attendance)
        .innerJoin(students, eq(attendance.studentId, students.id))
        .where(eq(attendance.courseId, courseId))
        .orderBy(attendance.timestamp); // Will reverse this in the component
};
