import { Link, useLocation } from "wouter";
import { Brain, BarChart3, Calculator, Atom, Landmark, BookOpen, Code, Puzzle, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn, getStrengthColor, formatPercentage } from "@/lib/utils";
import type { Subject, UserProgress } from "@shared/schema";

export default function Sidebar() {
  const [location] = useLocation();
  const userId = 1; // Teja's user ID

  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });

  const { data: userProgress } = useQuery<UserProgress[]>({
    queryKey: [`/api/users/${userId}/progress`],
  });

  const getSubjectProgress = (subjectId: number) => {
    return userProgress?.find(p => p.subjectId === subjectId);
  };

  const getSubjectIcon = (subject: Subject) => {
    const iconMap: { [key: string]: any } = {
      "fas fa-calculator": Calculator,
      "fas fa-atom": Atom,
      "fas fa-landmark": Landmark,
      "fas fa-book-open": BookOpen,
      "fab fa-python": Code,
      "fab fa-js-square": Code,
      "fab fa-react": Code,
      "fas fa-puzzle-piece": Puzzle,
      "fas fa-chart-line": TrendingUp,
    };
    
    return iconMap[subject.icon] || Code;
  };

  const isActive = (path: string) => location === path || location.startsWith(path);

  const groupedSubjects = subjects?.reduce((acc, subject) => {
    if (!acc[subject.category]) {
      acc[subject.category] = [];
    }
    acc[subject.category].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>) || {};

  const categoryLabels = {
    core: "Core Subjects",
    programming: "Programming",
    aptitude: "Aptitude",
    languages: "Languages"
  };

  return (
    <aside className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto z-50">
      <div className="p-6 border-b border-neutral-100">
        <Link href="/dashboard">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-800">Teja's Learning</h1>
              <p className="text-xs text-neutral-500">AI-Powered Education</p>
            </div>
          </div>
        </Link>
      </div>

      <nav className="p-4 space-y-2">
        {/* User Profile Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">TJ</span>
            </div>
            <div>
              <p className="font-semibold text-neutral-800">Welcome, Teja!</p>
              <p className="text-xs text-neutral-500">Learning Streak: 7 days</p>
            </div>
          </div>
        </div>

        {/* Dashboard Link */}
        <Link href="/dashboard">
          <div className={cn(
            "flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer",
            isActive("/dashboard") || location === "/" 
              ? "bg-primary text-white" 
              : "text-neutral-700 hover:bg-neutral-100"
          )}>
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
        </Link>

        {/* Subject Categories */}
        {Object.entries(groupedSubjects).map(([category, categorySubjects]) => (
          <div key={category} className="space-y-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 py-2">
              {categoryLabels[category as keyof typeof categoryLabels] || category}
            </p>
            {categorySubjects.map((subject) => {
              const progress = getSubjectProgress(subject.id);
              const IconComponent = getSubjectIcon(subject);
              
              return (
                <Link key={subject.id} href={`/course/${subject.id}`}>
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer",
                    isActive(`/course/${subject.id}`)
                      ? "bg-primary/10 text-primary"
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}>
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-5 h-5 text-${subject.color}`} />
                      <span>{subject.name}</span>
                    </div>
                    {progress && (
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        getStrengthColor(progress.strengthLevel)
                      )}>
                        {formatPercentage(progress.progressPercentage)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
