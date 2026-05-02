import { useQuery, useMutation } from "@tanstack/react-query";
import { Play, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getStrengthColor, formatTime } from "@/lib/utils";
import type { Subject, UserProgress, StudySession } from "@shared/schema";

interface ActiveSessionsProps {
  userId: number;
}

export default function ActiveSessions({ userId }: ActiveSessionsProps) {
  const { toast } = useToast();

  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });

  const { data: userProgress } = useQuery<UserProgress[]>({
    queryKey: [`/api/users/${userId}/progress`],
  });

  const { data: activeSessions } = useQuery<StudySession[]>({
    queryKey: [`/api/users/${userId}/sessions`],
  });

  const startSession = useMutation({
    mutationFn: async (data: { subjectId: number; duration: number }) => {
      return apiRequest("POST", "/api/sessions", {
        userId,
        subjectId: data.subjectId,
        duration: data.duration,
        status: "active"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/sessions`] });
      toast({
        title: "Session Started!",
        description: "Your learning session has begun. Stay focused!",
      });
    },
  });

  const resumeSession = useMutation({
    mutationFn: async (sessionId: number) => {
      return apiRequest("PATCH", `/api/sessions/${sessionId}`, {
        status: "active"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/sessions`] });
      toast({
        title: "Session Resumed!",
        description: "Welcome back to your learning session!",
      });
    },
  });

  // Mock session data for display
  const mockSessions = [
    {
      subject: subjects?.find(s => s.name === "React"),
      progress: userProgress?.find(p => p.subjectId === 7),
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
      alt: "React development workspace",
      sessionId: "react-fundamentals",
      timeLeft: "45 min left",
      topic: "Component Lifecycle & State Management"
    },
    {
      subject: subjects?.find(s => s.name === "Mathematics"),
      progress: userProgress?.find(p => p.subjectId === 1),
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
      alt: "Mathematical equations on blackboard",
      sessionId: "calculus",
      timeLeft: "20 min left",
      topic: "Integration Techniques"
    },
    {
      subject: subjects?.find(s => s.name === "History"),
      progress: userProgress?.find(p => p.subjectId === 3),
      imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
      alt: "Ancient historical artifacts and scrolls",
      sessionId: "history",
      timeLeft: "New Session",
      topic: "World War II Era"
    }
  ];

  const handleStartSession = (subjectId: number, subjectName: string) => {
    startSession.mutate({ subjectId, duration: 60 }); // 1 hour default
  };

  const handleResumeSession = (sessionId: string) => {
    // For now, just show a toast since we're using mock data
    toast({
      title: "Session Resumed!",
      description: `Continuing your ${sessionId.replace('-', ' ')} session...`,
    });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Continue Learning</h2>
        <div className="flex space-x-3">
          <button className="text-neutral-500 hover:text-neutral-700 text-sm flex items-center space-x-1">
            <span>Filter</span>
          </button>
          <button className="text-neutral-500 hover:text-neutral-700 text-sm flex items-center space-x-1">
            <span>Sort</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSessions.map((session, index) => {
          if (!session.subject || !session.progress) return null;

          const strengthLevel = session.progress.strengthLevel;
          const progressPercentage = session.progress.progressPercentage;

          return (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <img 
                src={session.imageUrl} 
                alt={session.alt}
                className="w-full h-32 object-cover" 
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <i className={`${session.subject.icon} text-${session.subject.color}`}></i>
                    <span className="font-semibold text-neutral-800">{session.subject.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStrengthColor(strengthLevel)}`}>
                    {strengthLevel === "strong" ? "Strong" : strengthLevel === "weak" ? "Weak Area" : "Average"}
                  </span>
                </div>
                
                <p className="text-neutral-600 text-sm mb-4">{session.topic}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.timeLeft}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{Math.round(progressPercentage)}%</span>
                    </span>
                  </div>
                </div>
                
                <Progress value={progressPercentage} className="mb-4" />
                
                <Button 
                  className={`w-full font-medium ${
                    strengthLevel === "weak" 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                  onClick={() => {
                    if (session.timeLeft === "New Session") {
                      handleStartSession(session.subject!.id, session.subject!.name);
                    } else {
                      handleResumeSession(session.sessionId);
                    }
                  }}
                  disabled={startSession.isPending}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {session.timeLeft === "New Session" ? "Start Learning" : "Resume Session"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
