import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Achievement } from "@shared/schema";

interface AchievementsProps {
  userId: number;
}

export default function Achievements({ userId }: AchievementsProps) {
  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: [`/api/users/${userId}/achievements`],
  });

  // Mock achievements for display
  const mockAchievements = [
    {
      title: "Python Master",
      description: "Completed advanced Python course",
      icon: Trophy,
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      title: "Week Warrior",
      description: "7-day learning streak",
      icon: Medal,
      gradient: "from-green-400 to-blue-500"
    },
    {
      title: "Quiz Champion",
      description: "Perfect score in Math quiz",
      icon: Star,
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Recent Achievements</h2>
        <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium">
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockAchievements.map((achievement, index) => {
          const IconComponent = achievement.icon;
          return (
            <div 
              key={index}
              className={`bg-gradient-to-r ${achievement.gradient} p-4 rounded-xl text-white`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">{achievement.title}</div>
                  <div className="text-sm opacity-90">{achievement.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
