import { useMutation } from "@tanstack/react-query";
import { Zap, Play, Brain, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatSessionTime } from "@/lib/utils";

interface QuickActionsProps {
  userId: number;
}

export default function QuickActions({ userId }: QuickActionsProps) {
  const { toast } = useToast();

  const startQuickSession = useMutation({
    mutationFn: async (duration: number) => {
      return apiRequest("POST", "/api/sessions", {
        userId,
        duration,
        status: "active"
      });
    },
    onSuccess: (_, duration) => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/sessions`] });
      toast({
        title: "Quick Session Started!",
        description: `Your ${formatSessionTime(duration)} study session has begun. Stay focused!`,
      });
    },
  });

  const sessions = [
    { duration: 15, icon: Zap, color: "blue", label: "Quick Review", description: "15 min" },
    { duration: 30, icon: Play, color: "green", label: "Focused Study", description: "30 min" },
    { duration: 45, icon: Brain, color: "purple", label: "Deep Dive", description: "45 min" },
    { duration: 60, icon: Clock, color: "orange", label: "Intensive", description: "1 hour" },
    { duration: 120, icon: Flame, color: "red", label: "Marathon", description: "2 hours" },
  ];

  const handleStartSession = (duration: number) => {
    startQuickSession.mutate(duration);
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6">Quick Study Sessions</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sessions.map((session) => {
          const IconComponent = session.icon;
          return (
            <Button
              key={session.duration}
              variant="outline"
              className="h-auto p-4 bg-white hover:shadow-md transition-all hover:scale-105 flex flex-col items-center space-y-3"
              onClick={() => handleStartSession(session.duration)}
              disabled={startQuickSession.isPending}
            >
              <div className={`w-12 h-12 bg-${session.color}-100 rounded-lg flex items-center justify-center`}>
                <IconComponent className={`text-${session.color}-600 w-6 h-6`} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-neutral-800">{session.description}</div>
                <div className="text-xs text-neutral-500">{session.label}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
