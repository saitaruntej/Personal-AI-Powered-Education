import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DashboardStats } from "@shared/schema";

interface ProgressAnalyticsProps {
  stats: DashboardStats;
}

export default function ProgressAnalytics({ stats }: ProgressAnalyticsProps) {
  const doughnutRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load Chart.js dynamically
    const loadChartJs = async () => {
      const Chart = (await import('chart.js/auto')).default;
      
      // Strength vs Weakness Doughnut Chart
      if (doughnutRef.current) {
        const ctx = doughnutRef.current.getContext('2d');
        if (ctx) {
          new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Strong Areas', 'Weak Areas'],
              datasets: [{
                data: [stats.strengthVsWeakness.strongAreas, stats.strengthVsWeakness.weakAreas],
                backgroundColor: ['#10B981', '#EF4444'],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true
                  }
                }
              }
            }
          });
        }
      }

      // Weekly Pattern Line Chart
      if (lineRef.current) {
        const ctx = lineRef.current.getContext('2d');
        if (ctx) {
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                label: 'Study Hours',
                data: stats.weeklyHours,
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5
                }
              }
            }
          });
        }
      }
    };

    loadChartJs();
  }, [stats]);

  const totalWeeklyHours = stats.weeklyHours.reduce((sum, hours) => sum + hours, 0);
  const averageDaily = totalWeeklyHours / 7;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Strength vs Weakness Analysis</span>
            <button className="text-neutral-500 hover:text-neutral-700">
              <ExternalLink className="w-4 h-4" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 mb-4">
            <canvas ref={doughnutRef}></canvas>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{stats.strengthVsWeakness.strongAreas}</div>
              <div className="text-sm text-neutral-500">Strong Areas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{stats.strengthVsWeakness.weakAreas}</div>
              <div className="text-sm text-neutral-500">Weak Areas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Weekly Study Pattern</span>
            <Select defaultValue="this-week">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 mb-4">
            <canvas ref={lineRef}></canvas>
          </div>
          <div className="flex justify-between text-sm text-neutral-500">
            <span>Total: <strong>{totalWeeklyHours.toFixed(1)} hours</strong></span>
            <span>Avg/day: <strong>{averageDaily.toFixed(1)} hours</strong></span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
