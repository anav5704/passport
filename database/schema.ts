import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Course table
export const courses = sqliteTable("courses", {
    courseCode: text("course_code").primaryKey(),
    leaderName: text("leader_name").notNull(),
});

// Student table
export const students = sqliteTable("students", {
    studentId: text("student_id").primaryKey(),
    studentName: text("student_name").notNull(),
    sponsor: text("sponsor").notNull(),
});

// Attendance table
export const attendance = sqliteTable("attendance", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: text("student_id").notNull(),
    studentName: text("student_name").notNull(),
    sponsor: text("sponsor").notNull(),
    datetime: text("datetime").notNull(),
    courseCode: text("course_code").notNull(),
    leaderName: text("leader_name").notNull(),
});

// Define relationships
export const coursesRelations = relations(courses, ({ many }) => ({
    attendance: many(attendance),
}));

export const studentsRelations = relations(students, ({ many }) => ({
    attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    course: one(courses, {
        fields: [attendance.courseCode],
        references: [courses.courseCode],
    }),
    student: one(students, {
        fields: [attendance.studentId],
        references: [students.studentId],
    }),
}));

// Export types for TypeScript
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
