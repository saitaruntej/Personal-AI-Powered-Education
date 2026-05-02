import { Flame, Clock, PieChart, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardStats } from "@shared/schema";

interface StatsOverviewProps {
  stats: DashboardStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Learning Streak</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.learningStreak} days</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Flame className="text-secondary w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-secondary text-sm">
              <span>Keep it up!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Study Hours Today</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.todayHours} hrs</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="text-primary w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-primary text-sm">
              <span>Goal: 3 hrs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Overall Progress</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.overallProgress}%</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <PieChart className="text-accent w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={stats.overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Weak Areas</p>
              <p className="text-2xl font-bold text-red-500">{stats.weakAreas}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-red-500 w-6 h-6" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-red-500 text-sm">
              <span>Focus needed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
