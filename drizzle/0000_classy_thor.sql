CREATE TABLE `attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` text NOT NULL,
	`student_name` text NOT NULL,
	`sponsor` text NOT NULL,
	`datetime` text NOT NULL,
	`course_code` text NOT NULL,
	`leader_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`course_code` text PRIMARY KEY NOT NULL,
	`leader_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`student_id` text PRIMARY KEY NOT NULL,
	`student_name` text NOT NULL,
	`sponsor` text NOT NULL
);
