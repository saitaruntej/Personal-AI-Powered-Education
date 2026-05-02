import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(hours: number): string {
  if (hours >= 1) {
    return `${hours.toFixed(1)} hrs`;
  }
  return `${Math.round(hours * 60)} min`;
}

export function getStrengthColor(strengthLevel: string): string {
  switch (strengthLevel) {
    case "strong":
      return "text-green-600 bg-green-100";
    case "average":
      return "text-amber-600 bg-amber-100";
    case "weak":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function calculateSessionProgress(startTime: Date, duration: number): number {
  const elapsed = (Date.now() - startTime.getTime()) / 1000 / 60; // minutes
  return Math.min(100, (elapsed / duration) * 100);
}

export function formatSessionTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}
