import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// User table
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
});

// Course table
export const courses = sqliteTable("courses", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code").notNull().unique(),
    leaderId: integer("leader_id")
        .notNull()
        .references(() => users.id),
    lastAccessed: text("last_accessed"),
});

// Student table
export const students = sqliteTable("students", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: text("student_id").notNull().unique(),
    studentSignature: text("student_signature").notNull().unique(),
});

// Session table
export const sessions = sqliteTable("sessions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    date: text("date").notNull(),
    startTime: integer("start_time").notNull(),
    courseId: integer("course_id")
        .notNull()
        .references(() => courses.id),
});

// Attendance table
export const attendance = sqliteTable("attendance", {
    studentId: integer("student_id")
        .notNull()
        .references(() => students.id),
    sessionId: integer("session_id")
        .notNull()
        .references(() => sessions.id),
    timestamp: text("timestamp").notNull(),
}, (table) => [
    primaryKey({ columns: [table.studentId, table.sessionId] }),
]);

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
    courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
    leader: one(users, {
        fields: [courses.leaderId],
        references: [users.id],
    }),
    sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
    course: one(courses, {
        fields: [sessions.courseId],
        references: [courses.id],
    }),
    attendance: many(attendance),
}));

export const studentsRelations = relations(students, ({ many }) => ({
    attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    session: one(sessions, {
        fields: [attendance.sessionId],
        references: [sessions.id],
    }),
    student: one(students, {
        fields: [attendance.studentId],
        references: [students.id],
    }),
}));

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
