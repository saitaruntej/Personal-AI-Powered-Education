import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Brain, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import StatsOverview from "@/components/dashboard/stats-overview";
import AiRecommendations from "@/components/dashboard/ai-recommendations";
import ProgressAnalytics from "@/components/dashboard/progress-analytics";
import ActiveSessions from "@/components/dashboard/active-sessions";
import QuickActions from "@/components/dashboard/quick-actions";
import Achievements from "@/components/dashboard/achievements";
import { Button } from "@/components/ui/button";
import { getGreeting } from "@/lib/utils";
import type { DashboardStats } from "@shared/schema";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const userId = 1; // Teja's user ID

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/1"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user/1"],
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/users/1/recommendations"],
  });

  const handleQuickAssessment = () => {
    navigate("/assessment");
  };

  const handleDetailedProgress = () => {
    // Navigate to detailed progress view
    console.log("Navigate to detailed progress");
  };

  if (statsLoading) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-6">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                {getGreeting()}, <span className="text-primary">Teja</span>! 🌟
              </h1>
              <p className="text-neutral-600">
                Ready to continue your learning journey? You're doing amazing!
              </p>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={handleQuickAssessment}
                className="flex items-center space-x-2 bg-primary text-white hover:bg-primary/90"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Quick Assessment</span>
              </Button>
              <Button 
                variant="outline"
                onClick={handleDetailedProgress}
                className="flex items-center space-x-2"
              >
                <Clock className="w-4 h-4" />
                <span>Detailed Progress</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        {stats && <StatsOverview stats={stats} />}

        {/* AI Recommendations */}
        <AiRecommendations recommendations={recommendations || []} />

        {/* Progress Analytics */}
        {stats && <ProgressAnalytics stats={stats} />}

        {/* Active Sessions */}
        <ActiveSessions userId={userId} />

        {/* Quick Actions */}
        <QuickActions userId={userId} />

        {/* Recent Achievements */}
        <Achievements userId={userId} />
      </main>
    </div>
  );
}
