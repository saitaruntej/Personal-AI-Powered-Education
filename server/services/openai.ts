import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface PersonalizedContent {
  explanation: string;
  examples: string[];
  practiceProblems: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface WeaknessAnalysis {
  weakAreas: string[];
  recommendations: string[];
  focusTopics: string[];
  studyPlan: string;
}

export interface AiRecommendation {
  type: 'focus' | 'strength' | 'improvement';
  content: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export async function generatePersonalizedContent(
  subject: string,
  topic: string,
  userLevel: string,
  weakAreas: string[]
): Promise<PersonalizedContent> {
  try {
    const prompt = `Generate personalized learning content for Teja studying ${subject}, specifically ${topic}. 
    User level: ${userLevel}
    Weak areas: ${weakAreas.join(', ')}
    
    Provide content that addresses Teja's specific learning needs and weak areas. 
    Respond with JSON in this format: {
      "explanation": "clear explanation tailored to Teja's level",
      "examples": ["practical example 1", "practical example 2"],
      "practiceProblems": ["problem 1", "problem 2", "problem 3"],
      "difficulty": "beginner|intermediate|advanced"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert AI tutor specializing in personalized education for Teja. Generate comprehensive, actionable learning content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error(`Failed to generate personalized content: ${error.message}`);
  }
}

export async function generateAssessmentQuestions(
  subject: string,
  difficulty: string,
  count: number
): Promise<AssessmentQuestion[]> {
  try {
    const prompt = `Generate ${count} assessment questions for ${subject} at ${difficulty} level.
    Each question should test different aspects and help identify strengths/weaknesses.
    
    Respond with JSON in this format: {
      "questions": [
        {
          "id": "unique_id",
          "question": "question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": 0,
          "explanation": "why this answer is correct",
          "topic": "specific topic tested",
          "difficulty": "easy|medium|hard"
        }
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert assessment creator. Generate high-quality, educational questions that accurately assess knowledge."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.questions;
  } catch (error) {
    throw new Error(`Failed to generate assessment questions: ${error.message}`);
  }
}

export async function analyzeWeaknesses(
  assessmentResults: any[],
  userHistory: any[]
): Promise<WeaknessAnalysis> {
  try {
    const prompt = `Analyze Teja's learning performance and identify weaknesses.
    Assessment results: ${JSON.stringify(assessmentResults)}
    Learning history: ${JSON.stringify(userHistory)}
    
    Provide detailed analysis and recommendations for Teja's improvement.
    Respond with JSON in this format: {
      "weakAreas": ["area1", "area2"],
      "recommendations": ["recommendation1", "recommendation2"],
      "focusTopics": ["topic1", "topic2"],
      "studyPlan": "detailed study plan for Teja"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert learning analyst. Provide detailed, actionable insights for Teja's personalized learning journey."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error(`Failed to analyze weaknesses: ${error.message}`);
  }
}

export async function generateDailyRecommendations(
  userProgress: any,
  recentActivity: any[]
): Promise<AiRecommendation[]> {
  try {
    const prompt = `Generate personalized daily recommendations for Teja based on progress and activity.
    User progress: ${JSON.stringify(userProgress)}
    Recent activity: ${JSON.stringify(recentActivity)}
    
    Generate 3-5 specific, actionable recommendations for Teja's learning today.
    Respond with JSON in this format: {
      "recommendations": [
        {
          "type": "focus|strength|improvement",
          "content": "specific recommendation text",
          "priority": "high|medium|low",
          "actionable": true
        }
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Teja's personal AI learning assistant. Generate encouraging, specific recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return result.recommendations;
  } catch (error) {
    throw new Error(`Failed to generate recommendations: ${error.message}`);
  }
}

export async function generateProgrammingExercise(
  language: string,
  topic: string,
  difficulty: string
): Promise<any> {
  try {
    const prompt = `Generate a ${difficulty} level ${language} programming exercise for ${topic}.
    Include problem description, starter code, solution, and explanation.
    
    Respond with JSON in this format: {
      "title": "exercise title",
      "description": "problem description",
      "starterCode": "starting code template",
      "solution": "complete solution",
      "explanation": "step-by-step explanation",
      "testCases": ["test case 1", "test case 2"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert programming instructor. Generate educational coding exercises."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error(`Failed to generate programming exercise: ${error.message}`);
  }
}
