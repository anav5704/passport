import {
    users,
    courses,
    students,
    attendance,
    sessions,
} from "@database/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "@database";
import { Result } from "@/utils/types";

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
export const createCourse = async (
    code: string,
    leaderId: number
): Promise<Result<any>> => {
    // Check if course code already exists
    const existingCourse = await db
        .select()
        .from(courses)
        .where(eq(courses.code, code.trim()))
        .limit(1);

    if (existingCourse.length > 0) {
        return { ok: false, error: "Course code already exists" };
    }

    const [course] = await db
        .insert(courses)
        .values({
            code: code.trim(),
            leaderId,
        })
        .returning();
    return { ok: true, value: course };
};

export const getCoursesByLeaderId = async (leaderId: number) => {
    return await db
        .select()
        .from(courses)
        .where(eq(courses.leaderId, leaderId));
};

export const updateCourse = async (
    courseId: number,
    code: string
): Promise<Result<any>> => {
    // Check if course code already exists (excluding the current course)
    const existingCourse = await db
        .select()
        .from(courses)
        .where(
            and(
                eq(courses.code, code.trim()),
                sql`${courses.id} != ${courseId}`
            )
        )
        .limit(1);

    if (existingCourse.length > 0) {
        return { ok: false, error: "Course code already exists" };
    }

    const [updatedCourse] = await db
        .update(courses)
        .set({ code: code.trim() })
        .where(eq(courses.id, courseId))
        .returning();
    return { ok: true, value: updatedCourse };
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
export const setupUserWithCourse = async (
    name: string,
    courseCode: string
): Promise<Result<any>> => {
    try {
        // Insert user
        const user = await createUser(name);

        // Insert course
        const courseResult = await createCourse(courseCode, user.id);

        if (!courseResult.ok) {
            return courseResult;
        }

        const course = courseResult.value;

        // Set the course as accessed (since it's the user's first course)
        await updateCourseLastAccessed(course.id);

        return { ok: true, value: user };
    } catch (error) {
        return { ok: false, error: "Failed to setup user with course" };
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
        throw error;
    }
};

// Session queries
export const createSession = async (
    courseId: number,
    timestamp?: string
): Promise<Result<any>> => {
    const sessionTimestamp = timestamp || new Date().toISOString();
    const sessionDate = new Date(sessionTimestamp);

    // Round timestamp to the current hour (e.g., 10:15 becomes 10:00)
    const roundedTimestamp = new Date(sessionDate);
    roundedTimestamp.setMinutes(0, 0, 0);

    // Get the start and end of the current hour for checking duplicates
    const hourStart = new Date(roundedTimestamp);
    const hourEnd = new Date(roundedTimestamp);
    hourEnd.setMinutes(59, 59, 999);

    // Check if a session already exists for this course in the same hour
    const existingSession = await db
        .select()
        .from(sessions)
        .where(
            and(
                eq(sessions.courseId, courseId),
                sql`${sessions.timestamp} >= ${hourStart.toISOString()}`,
                sql`${sessions.timestamp} <= ${hourEnd.toISOString()}`
            )
        )
        .limit(1);

    if (existingSession.length > 0) {
        return {
            ok: false,
            error: "Session already in progress",
        };
    }

    const [session] = await db
        .insert(sessions)
        .values({
            courseId,
            timestamp: roundedTimestamp.toISOString(),
        })
        .returning();
    return { ok: true, value: session };
};

export const getSessionsForCourse = async (courseId: number) => {
    return await db
        .select()
        .from(sessions)
        .where(eq(sessions.courseId, courseId))
        .orderBy(desc(sessions.timestamp));
};

export const getSessionById = async (sessionId: number) => {
    const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId));
    return session;
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
export const logAttendance = async (
    studentId: number,
    sessionId: number
): Promise<Result<any>> => {
    // Check if attendance already exists for this student and session
    const existingAttendance = await db
        .select()
        .from(attendance)
        .where(
            and(
                eq(attendance.studentId, studentId),
                eq(attendance.sessionId, sessionId)
            )
        )
        .limit(1);

    if (existingAttendance.length > 0) {
        return { ok: false, error: "Attendance already taken" };
    }

    const [attendanceRecord] = await db
        .insert(attendance)
        .values({
            studentId,
            sessionId,
        })
        .returning();
    return { ok: true, value: attendanceRecord };
};

export const getAttendanceByStudentAndSession = async (
    studentId: number,
    sessionId: number
) => {
    return await db
        .select()
        .from(attendance)
        .where(
            and(
                eq(attendance.studentId, studentId),
                eq(attendance.sessionId, sessionId)
            )
        );
};

export const getSessionsWithAttendanceCount = async (courseId: number) => {
    return await db
        .select({
            id: sessions.id,
            timestamp: sessions.timestamp,
            courseId: sessions.courseId,
            attendanceCount: sql<number>`count(${attendance.studentId})`.as(
                "attendanceCount"
            ),
        })
        .from(sessions)
        .leftJoin(attendance, eq(sessions.id, attendance.sessionId))
        .where(eq(sessions.courseId, courseId))
        .groupBy(sessions.id, sessions.timestamp, sessions.courseId)
        .orderBy(desc(sessions.timestamp));
};

export const getAttendanceHistoryForCourse = async (courseId: number) => {
    return await db
        .select({
            studentId: students.studentId,
            sessionId: attendance.sessionId,
            sessionTimestamp: sessions.timestamp,
        })
        .from(attendance)
        .innerJoin(students, eq(attendance.studentId, students.id))
        .innerJoin(sessions, eq(attendance.sessionId, sessions.id))
        .where(eq(sessions.courseId, courseId))
        .orderBy(sessions.timestamp);
};

export const getAttendanceForSession = async (sessionId: number) => {
    return await db
        .select({
            studentId: students.studentId,
            sessionTimestamp: sessions.timestamp,
        })
        .from(attendance)
        .innerJoin(students, eq(attendance.studentId, students.id))
        .innerJoin(sessions, eq(attendance.sessionId, sessions.id))
        .where(eq(attendance.sessionId, sessionId))
        .orderBy(students.studentId);
};
