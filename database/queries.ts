import { users, courses } from "@database/schema";
import { eq } from "drizzle-orm";
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
    return await db.insert(courses).values({
        code: code.trim(),
        leaderId,
    });
};

export const getCoursesByLeaderId = async (leaderId: number) => {
    return await db
        .select()
        .from(courses)
        .where(eq(courses.leaderId, leaderId));
};

// Combined queries
export const setupUserWithCourse = async (name: string, courseCode: string) => {
    try {
        // Insert user
        const user = await createUser(name);

        // Insert course
        await createCourse(courseCode, user.id);

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
            })),
        };
    } catch (error) {
        console.error("Error loading user:", error);
        throw error;
    }
};
