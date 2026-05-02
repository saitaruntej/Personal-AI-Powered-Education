import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Play, BookOpen, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/ui/sidebar";
import { formatTime, getProgressColor } from "@/lib/utils";
import type { Subject, Course, UserProgress } from "@shared/schema";

export default function CoursePage() {
  const { subjectId } = useParams();
  const userId = 1; // Teja's user ID

  const { data: subject, isLoading: subjectLoading } = useQuery<Subject>({
    queryKey: [`/api/subjects/${subjectId}`],
  });

  const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: [`/api/subjects/${subjectId}/courses`],
  });

  const { data: progress } = useQuery<UserProgress>({
    queryKey: [`/api/users/${userId}/progress/subjects/${subjectId}`],
  });

  if (subjectLoading || coursesLoading) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-800 mb-4">Subject Not Found</h1>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <i className={`${subject.icon} text-${subject.color} text-xl`}></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">{subject.name}</h1>
              <p className="text-neutral-600">{subject.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {progress && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Progress</span>
                <span className="text-2xl font-bold text-primary">
                  {Math.round(progress.progressPercentage)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={progress.progressPercentage} 
                className="mb-4" 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-800">
                    {formatTime(progress.timeSpent)}
                  </div>
                  <div className="text-sm text-neutral-500">Time Spent</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${progress.strengthLevel === 'strong' ? 'text-green-600' : progress.strengthLevel === 'weak' ? 'text-red-600' : 'text-amber-600'}`}>
                    {progress.strengthLevel.charAt(0).toUpperCase() + progress.strengthLevel.slice(1)}
                  </div>
                  <div className="text-sm text-neutral-500">Strength Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-800">
                    {progress.weakAreas?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-500">Focus Areas</div>
                </div>
              </div>
              
              {progress.weakAreas && progress.weakAreas.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-neutral-800 mb-2">Areas for Improvement:</h4>
                  <div className="flex flex-wrap gap-2">
                    {progress.weakAreas.map((area, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Courses List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-800">Available Courses</h2>
          
          {courses && courses.length > 0 ? (
            <div className="grid gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-neutral-600 mb-4">{course.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-neutral-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.estimatedHours} hours</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span className="capitalize">{course.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        <Button className="flex items-center space-x-2">
                          <Play className="w-4 h-4" />
                          <span>Start Learning</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-neutral-500 mb-4">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No courses available for this subject yet.</p>
                </div>
                <Button variant="outline">
                  Request Course Content
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
