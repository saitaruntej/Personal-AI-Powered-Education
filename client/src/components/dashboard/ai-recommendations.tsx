import { Bot, Lightbulb, Star, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AiRecommendation } from "@shared/schema";

interface AiRecommendationsProps {
  recommendations: AiRecommendation[];
}

export default function AiRecommendations({ recommendations }: AiRecommendationsProps) {
  const defaultRecommendations = [
    "Focus on React fundamentals - you're struggling with component lifecycle",
    "Great progress in Python! Try advanced data structures next",
    "History needs attention - spend 30 minutes daily on World War topics"
  ];

  const displayRecommendations = recommendations.length > 0 
    ? recommendations.map(r => r.content)
    : defaultRecommendations;

  const handleCreateStudyPlan = () => {
    // This would trigger AI generation of a personalized study plan
    console.log("Creating personalized study plan for Teja...");
  };

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-6 h-6" />
              <h2 className="text-xl font-bold">AI Recommendations for Teja</h2>
            </div>
            <p className="text-white/90 mb-4">Based on your recent performance, here's what I suggest:</p>
            <div className="space-y-2">
              {displayRecommendations.slice(0, 3).map((recommendation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index === 0 && <Lightbulb className="w-4 h-4 text-yellow-300" />}
                  {index === 1 && <Star className="w-4 h-4 text-yellow-300" />}
                  {index === 2 && <Target className="w-4 h-4 text-yellow-300" />}
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ml-6">
            <Button 
              onClick={handleCreateStudyPlan}
              className="bg-white text-primary hover:bg-neutral-50 font-semibold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Create Study Plan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
