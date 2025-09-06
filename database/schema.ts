import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
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
    code: text("code").notNull(),
    leaderId: integer("leader_id")
        .notNull()
        .references(() => users.id),
    lastAccessed: text("last_accessed"),
});

// Student table
export const students = sqliteTable("students", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: text("student_id").notNull(),
    studentSignature: text("student_signature").notNull(),
});

// Attendance table
export const attendance = sqliteTable("attendance", {
    attendanceId: integer("attendance_id").primaryKey({ autoIncrement: true }),
    studentId: integer("student_id")
        .notNull()
        .references(() => students.id),
    courseId: integer("course_id")
        .notNull()
        .references(() => courses.id),
    timestamp: text("timestamp").notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
    courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
    leader: one(users, {
        fields: [courses.leaderId],
        references: [users.id],
    }),
    attendance: many(attendance),
}));

export const studentsRelations = relations(students, ({ many }) => ({
    attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    course: one(courses, {
        fields: [attendance.courseId],
        references: [courses.id],
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

export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
