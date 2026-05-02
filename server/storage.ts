import { 
  users, subjects, courses, userProgress, assessments, studySessions, 
  achievements, aiRecommendations,
  type User, type InsertUser, type Subject, type InsertSubject,
  type Course, type InsertCourse, type UserProgress, type InsertUserProgress,
  type Assessment, type InsertAssessment, type StudySession, type InsertStudySession,
  type Achievement, type InsertAchievement, type AiRecommendation, type InsertAiRecommendation,
  type DashboardStats
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Subjects and courses
  getAllSubjects(): Promise<Subject[]>;
  getSubjectsByCategory(category: string): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  getCoursesBySubject(subjectId: number): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // User progress
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressBySubject(userId: number, subjectId: number): Promise<UserProgress | undefined>;
  createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateProgressStrength(userId: number, subjectId: number, strengthLevel: string, weakAreas: string[], strongAreas: string[]): Promise<void>;

  // Assessments
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getUserAssessments(userId: number): Promise<Assessment[]>;
  getAssessmentsBySubject(userId: number, subjectId: number): Promise<Assessment[]>;

  // Study sessions
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  getActiveSession(userId: number): Promise<StudySession | undefined>;
  updateSessionStatus(id: number, status: string, actualDuration?: number): Promise<StudySession>;
  getUserSessions(userId: number): Promise<StudySession[]>;

  // Achievements
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // AI Recommendations
  getUserRecommendations(userId: number): Promise<AiRecommendation[]>;
  createRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  markRecommendationInactive(id: number): Promise<void>;

  // Dashboard stats
  getDashboardStats(userId: number): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private subjects: Map<number, Subject> = new Map();
  private courses: Map<number, Course> = new Map();
  private userProgress: Map<number, UserProgress> = new Map();
  private assessments: Map<number, Assessment> = new Map();
  private studySessions: Map<number, StudySession> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private aiRecommendations: Map<number, AiRecommendation> = new Map();
  
  private currentId = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default user (Teja)
    const tejaUser: User = {
      id: 1,
      username: "teja",
      displayName: "Teja",
      email: "teja@learning.com",
      learningStreak: 7,
      totalStudyHours: 45.5,
      overallProgress: 73,
      createdAt: new Date()
    };
    this.users.set(1, tejaUser);

    // Initialize subjects
    const defaultSubjects: Subject[] = [
      { id: 1, name: "Mathematics", category: "core", icon: "fas fa-calculator", color: "blue-500", description: "Advanced mathematical concepts" },
      { id: 2, name: "Science", category: "core", icon: "fas fa-atom", color: "green-500", description: "Scientific principles and discoveries" },
      { id: 3, name: "History", category: "core", icon: "fas fa-landmark", color: "amber-500", description: "World history and civilizations" },
      { id: 4, name: "Literature", category: "core", icon: "fas fa-book-open", color: "purple-500", description: "Classic and modern literature" },
      { id: 5, name: "Python", category: "programming", icon: "fab fa-python", color: "blue-600", description: "Python programming language" },
      { id: 6, name: "JavaScript", category: "programming", icon: "fab fa-js-square", color: "yellow-500", description: "JavaScript development" },
      { id: 7, name: "React", category: "programming", icon: "fab fa-react", color: "cyan-500", description: "React framework" },
      { id: 8, name: "Logical Reasoning", category: "aptitude", icon: "fas fa-puzzle-piece", color: "indigo-500", description: "Logic and reasoning skills" },
      { id: 9, name: "Quantitative Aptitude", category: "aptitude", icon: "fas fa-chart-line", color: "green-600", description: "Mathematical problem solving" },
    ];

    defaultSubjects.forEach(subject => this.subjects.set(subject.id, subject));

    // Initialize some progress data
    const progressData: UserProgress[] = [
      { id: 1, userId: 1, subjectId: 1, courseId: null, progressPercentage: 85, strengthLevel: "strong", timeSpent: 12.5, lastAccessedAt: new Date(), weakAreas: [], strongAreas: ["Calculus", "Algebra"] },
      { id: 2, userId: 1, subjectId: 2, courseId: null, progressPercentage: 72, strengthLevel: "average", timeSpent: 8.3, lastAccessedAt: new Date(), weakAreas: ["Chemistry"], strongAreas: ["Physics"] },
      { id: 3, userId: 1, subjectId: 3, courseId: null, progressPercentage: 45, strengthLevel: "weak", timeSpent: 3.2, lastAccessedAt: new Date(), weakAreas: ["World War II", "Ancient History"], strongAreas: [] },
      { id: 4, userId: 1, subjectId: 4, courseId: null, progressPercentage: 78, strengthLevel: "strong", timeSpent: 6.7, lastAccessedAt: new Date(), weakAreas: [], strongAreas: ["Poetry", "Analysis"] },
      { id: 5, userId: 1, subjectId: 5, courseId: null, progressPercentage: 92, strengthLevel: "strong", timeSpent: 15.2, lastAccessedAt: new Date(), weakAreas: [], strongAreas: ["Data Structures", "OOP"] },
      { id: 6, userId: 1, subjectId: 6, courseId: null, progressPercentage: 68, strengthLevel: "average", timeSpent: 9.1, lastAccessedAt: new Date(), weakAreas: ["Async/Await"], strongAreas: ["ES6", "DOM"] },
      { id: 7, userId: 1, subjectId: 7, courseId: null, progressPercentage: 34, strengthLevel: "weak", timeSpent: 4.5, lastAccessedAt: new Date(), weakAreas: ["Component Lifecycle", "State Management"], strongAreas: [] },
      { id: 8, userId: 1, subjectId: 8, courseId: null, progressPercentage: 81, strengthLevel: "strong", timeSpent: 7.8, lastAccessedAt: new Date(), weakAreas: [], strongAreas: ["Pattern Recognition"] },
      { id: 9, userId: 1, subjectId: 9, courseId: null, progressPercentage: 76, strengthLevel: "strong", timeSpent: 8.9, lastAccessedAt: new Date(), weakAreas: [], strongAreas: ["Statistics"] },
    ];

    progressData.forEach(progress => this.userProgress.set(progress.id, progress));

    this.currentId = 10;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubjectsByCategory(category: string): Promise<Subject[]> {
    return Array.from(this.subjects.values()).filter(subject => subject.category === category);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentId++;
    const subject: Subject = { ...insertSubject, id };
    this.subjects.set(id, subject);
    return subject;
  }

  async getCoursesBySubject(subjectId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.subjectId === subjectId);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressBySubject(userId: number, subjectId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      progress => progress.userId === userId && progress.subjectId === subjectId
    );
  }

  async createOrUpdateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getUserProgressBySubject(insertProgress.userId!, insertProgress.subjectId!);
    
    if (existing) {
      const updated = { ...existing, ...insertProgress, lastAccessedAt: new Date() };
      this.userProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentId++;
      const progress: UserProgress = { ...insertProgress, id, lastAccessedAt: new Date() };
      this.userProgress.set(id, progress);
      return progress;
    }
  }

  async updateProgressStrength(userId: number, subjectId: number, strengthLevel: string, weakAreas: string[], strongAreas: string[]): Promise<void> {
    const progress = await this.getUserProgressBySubject(userId, subjectId);
    if (progress) {
      const updated = { ...progress, strengthLevel, weakAreas, strongAreas, lastAccessedAt: new Date() };
      this.userProgress.set(progress.id, updated);
    }
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentId++;
    const assessment: Assessment = { ...insertAssessment, id, completedAt: new Date() };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getUserAssessments(userId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(assessment => assessment.userId === userId);
  }

  async getAssessmentsBySubject(userId: number, subjectId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(
      assessment => assessment.userId === userId && assessment.subjectId === subjectId
    );
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const id = this.currentId++;
    const session: StudySession = { ...insertSession, id, startedAt: new Date() };
    this.studySessions.set(id, session);
    return session;
  }

  async getActiveSession(userId: number): Promise<StudySession | undefined> {
    return Array.from(this.studySessions.values()).find(
      session => session.userId === userId && session.status === "active"
    );
  }

  async updateSessionStatus(id: number, status: string, actualDuration?: number): Promise<StudySession> {
    const session = this.studySessions.get(id);
    if (!session) throw new Error("Session not found");
    
    const updated = { 
      ...session, 
      status, 
      actualDuration,
      ...(status === "completed" && { completedAt: new Date() })
    };
    this.studySessions.set(id, updated);
    return updated;
  }

  async getUserSessions(userId: number): Promise<StudySession[]> {
    return Array.from(this.studySessions.values()).filter(session => session.userId === userId);
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentId++;
    const achievement: Achievement = { ...insertAchievement, id, earnedAt: new Date() };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getUserRecommendations(userId: number): Promise<AiRecommendation[]> {
    return Array.from(this.aiRecommendations.values()).filter(
      rec => rec.userId === userId && rec.isActive
    );
  }

  async createRecommendation(insertRecommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const id = this.currentId++;
    const recommendation: AiRecommendation = { ...insertRecommendation, id, createdAt: new Date() };
    this.aiRecommendations.set(id, recommendation);
    return recommendation;
  }

  async markRecommendationInactive(id: number): Promise<void> {
    const recommendation = this.aiRecommendations.get(id);
    if (recommendation) {
      this.aiRecommendations.set(id, { ...recommendation, isActive: false });
    }
  }

  async getDashboardStats(userId: number): Promise<DashboardStats> {
    const user = await this.getUser(userId);
    const userProgressData = await this.getUserProgress(userId);
    
    const strongAreas = userProgressData.filter(p => p.strengthLevel === "strong").length;
    const weakAreas = userProgressData.filter(p => p.strengthLevel === "weak").length;
    
    // Mock weekly hours for the last 7 days
    const weeklyHours = [2.5, 3, 1.5, 4, 2, 3.5, 2];
    
    return {
      learningStreak: user?.learningStreak || 0,
      todayHours: 2.5,
      overallProgress: user?.overallProgress || 0,
      weakAreas,
      totalStudyHours: user?.totalStudyHours || 0,
      weeklyHours,
      strengthVsWeakness: {
        strongAreas,
        weakAreas
      }
    };
  }
}

export const storage = new MemStorage();
