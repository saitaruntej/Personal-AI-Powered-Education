import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email"),
  learningStreak: integer("learning_streak").default(0),
  totalStudyHours: real("total_study_hours").default(0),
  overallProgress: real("overall_progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'core', 'programming', 'aptitude', 'languages'
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  description: text("description"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => subjects.id),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  estimatedHours: integer("estimated_hours").default(0),
  content: jsonb("content"), // structured course content
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  courseId: integer("course_id").references(() => courses.id),
  progressPercentage: real("progress_percentage").default(0),
  strengthLevel: text("strength_level").notNull(), // 'strong', 'average', 'weak'
  timeSpent: real("time_spent").default(0), // in hours
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  weakAreas: text("weak_areas").array(),
  strongAreas: text("strong_areas").array(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  type: text("type").notNull(), // 'quick', 'comprehensive', 'diagnostic'
  questions: jsonb("questions"),
  answers: jsonb("answers"),
  score: real("score"),
  weakAreasIdentified: text("weak_areas_identified").array(),
  recommendations: text("recommendations"),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  courseId: integer("course_id").references(() => courses.id),
  duration: integer("duration"), // planned duration in minutes
  actualDuration: integer("actual_duration"), // actual time spent
  status: text("status").notNull(), // 'active', 'paused', 'completed', 'abandoned'
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // 'study_plan', 'content', 'focus_area'
  content: text("content").notNull(),
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  completedAt: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationSchema>;

// Dashboard stats type
export type DashboardStats = {
  learningStreak: number;
  todayHours: number;
  overallProgress: number;
  weakAreas: number;
  totalStudyHours: number;
  weeklyHours: number[];
  strengthVsWeakness: {
    strongAreas: number;
    weakAreas: number;
  };
};
