import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Brain, CheckCircle, Clock, Target } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Subject } from "@shared/schema";

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function AssessmentPage() {
  const { subjectId } = useParams();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const userId = 1; // Teja's user ID

  const { data: subject } = useQuery<Subject>({
    queryKey: [`/api/subjects/${subjectId}`],
    enabled: !!subjectId,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<AssessmentQuestion[]>({
    queryKey: [`/api/ai/generate-assessment`],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/ai/generate-assessment", {
        subject: subject?.name || "General Knowledge",
        difficulty: "medium",
        count: 5
      });
      const data = await response.json();
      return data.questions;
    },
    enabled: !!subject,
  });

  const submitAssessment = useMutation({
    mutationFn: async (assessmentData: any) => {
      return apiRequest("POST", "/api/assessments", assessmentData);
    },
    onSuccess: () => {
      toast({
        title: "Assessment Completed!",
        description: "Your results have been saved and will help personalize your learning.",
      });
    },
  });

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (!questions) return;

    let correctAnswers = 0;
    const weakAreas: string[] = [];
    
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      } else {
        weakAreas.push(question.topic);
      }
    });

    const finalScore = (correctAnswers / questions.length) * 100;
    setScore(finalScore);
    setShowResults(true);

    // Submit assessment results
    submitAssessment.mutate({
      userId,
      subjectId: subjectId ? parseInt(subjectId) : null,
      type: "quick",
      questions: questions,
      answers: answers,
      score: finalScore,
      weakAreasIdentified: weakAreas,
      recommendations: `Focus on improving: ${weakAreas.slice(0, 3).join(", ")}`
    });
  };

  if (questionsLoading) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                Generating Your Personalized Assessment
              </h2>
              <p className="text-neutral-600">
                AI is creating questions tailored to your learning level...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <span>Assessment Complete!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {Math.round(score)}%
                  </div>
                  <p className="text-neutral-600">Your Score</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {answers.filter((answer, index) => 
                        questions && answer === questions[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-green-600">Correct</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {(questions?.length || 0) - answers.filter((answer, index) => 
                        questions && answer === questions[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-red-600">Incorrect</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {questions?.length || 0}
                    </div>
                    <div className="text-sm text-blue-600">Total Questions</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-800">
                    AI Recommendations for Teja:
                  </h3>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-primary">
                      {score >= 80 
                        ? "Excellent work! You have a strong grasp of this subject. Consider advancing to more challenging topics."
                        : score >= 60
                        ? "Good job! With some focused study on the areas you missed, you'll master this subject."
                        : "This assessment identified key areas for improvement. Focus on the topics you missed and try again soon."
                      }
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Link href="/dashboard">
                    <Button className="flex-1">
                      Return to Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setShowResults(false);
                      setScore(0);
                    }}
                  >
                    Retake Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Unable to Generate Assessment
            </h2>
            <p className="text-neutral-600 mb-6">
              Please try again or select a different subject.
            </p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">
                {subject ? `${subject.name} Assessment` : "Quick Assessment"}
              </h1>
              <p className="text-neutral-600">
                Personalized assessment to identify your strengths and areas for improvement
              </p>
            </div>
          </div>

          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-neutral-500">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} />
            </CardContent>
          </Card>

          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Question {currentQuestion + 1}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQ.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQ.difficulty}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg text-neutral-800">
                {currentQ.question}
              </div>

              <RadioGroup
                value={answers[currentQuestion]?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={answers[currentQuestion] === undefined}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit Assessment</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === undefined}
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
