import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertSubjectSchema, insertCourseSchema, 
  insertUserProgressSchema, insertAssessmentSchema, insertStudySessionSchema,
  insertAchievementSchema, insertAiRecommendationSchema 
} from "@shared/schema";
import { 
  generatePersonalizedContent, generateAssessmentQuestions, 
  analyzeWeaknesses, generateDailyRecommendations, generateProgrammingExercise 
} from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/user/username/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Subject routes
  app.get("/api/subjects", async (req, res) => {
    try {
      const category = req.query.category as string;
      const subjects = category 
        ? await storage.getSubjectsByCategory(category)
        : await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    try {
      const subjectData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(subjectData);
      res.status(201).json(subject);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Course routes
  app.get("/api/subjects/:subjectId/courses", async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const courses = await storage.getCoursesBySubject(subjectId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/progress/subjects/:subjectId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const subjectId = parseInt(req.params.subjectId);
      const progress = await storage.getUserProgressBySubject(userId, subjectId);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createOrUpdateProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Assessment routes
  app.get("/api/users/:userId/assessments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
      
      const assessments = subjectId 
        ? await storage.getAssessmentsBySubject(userId, subjectId)
        : await storage.getUserAssessments(userId);
      
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/assessments", async (req, res) => {
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(assessmentData);
      res.status(201).json(assessment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Study session routes
  app.get("/api/users/:userId/sessions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/sessions/active", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const session = await storage.getActiveSession(userId);
      res.json(session || null);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertStudySessionSchema.parse(req.body);
      const session = await storage.createStudySession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, actualDuration } = req.body;
      const session = await storage.updateSessionStatus(id, status, actualDuration);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Achievement routes
  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI-powered routes
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recommendations = await storage.getUserRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-content", async (req, res) => {
    try {
      const { subject, topic, userLevel, weakAreas } = req.body;
      const content = await generatePersonalizedContent(subject, topic, userLevel, weakAreas);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-assessment", async (req, res) => {
    try {
      const { subject, difficulty, count } = req.body;
      const questions = await generateAssessmentQuestions(subject, difficulty, count || 5);
      res.json({ questions });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/analyze-weaknesses", async (req, res) => {
    try {
      const { assessmentResults, userHistory } = req.body;
      const analysis = await analyzeWeaknesses(assessmentResults, userHistory);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/daily-recommendations", async (req, res) => {
    try {
      const { userProgress, recentActivity } = req.body;
      const recommendations = await generateDailyRecommendations(userProgress, recentActivity);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/programming-exercise", async (req, res) => {
    try {
      const { language, topic, difficulty } = req.body;
      const exercise = await generateProgrammingExercise(language, topic, difficulty);
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
