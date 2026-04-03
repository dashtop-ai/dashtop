"use client";

import { useState, useMemo } from "react";
import { Flame, Plus, Calendar, Clock, Zap } from "lucide-react";
import { type WidgetProps } from "../types";
import { type ExerciseLogConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface WorkoutEntry {
  id: string;
  date: string; // ISO date
  type: string;
  durationMin: number;
  calories: number;
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function generateLast7Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

const INITIAL_WORKOUTS: WorkoutEntry[] = [
  { id: "1", date: generateLast7Days()[0], type: "Strength", durationMin: 45, calories: 320 },
  { id: "2", date: generateLast7Days()[1], type: "Cardio", durationMin: 30, calories: 280 },
  { id: "3", date: generateLast7Days()[3], type: "HIIT", durationMin: 25, calories: 350 },
  { id: "4", date: generateLast7Days()[5], type: "Yoga", durationMin: 40, calories: 150 },
  { id: "5", date: generateLast7Days()[6], type: "Strength", durationMin: 50, calories: 400 },
];

export default function ExerciseLogWidget({
  config,
}: WidgetProps<ExerciseLogConfig>) {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(INITIAL_WORKOUTS);

  const last7Days = useMemo(() => generateLast7Days(), []);
  const todayStr = last7Days[last7Days.length - 1];

  const workoutDates = useMemo(
    () => new Set(workouts.map((w) => w.date)),
    [workouts]
  );

  // Streak calculation
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      if (workoutDates.has(dateStr)) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [workoutDates]);

  // Weekly stats
  const weekStats = useMemo(() => {
    const thisWeek = workouts.filter((w) => last7Days.includes(w.date));
    return {
      workouts: thisWeek.length,
      totalMin: thisWeek.reduce((sum, w) => sum + w.durationMin, 0),
      totalCal: thisWeek.reduce((sum, w) => sum + w.calories, 0),
    };
  }, [workouts, last7Days]);

  // Recent workouts (last 3)
  const recentWorkouts = useMemo(
    () =>
      [...workouts]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3),
    [workouts]
  );

  const handleLogWorkout = () => {
    const newEntry: WorkoutEntry = {
      id: String(Date.now()),
      date: todayStr,
      type: "Strength",
      durationMin: 35,
      calories: 290,
    };
    setWorkouts((prev) => [...prev, newEntry]);
  };

  return (
    <div className="flex flex-col h-full gap-3 p-3 overflow-hidden">
      {/* Header with streak */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Exercise Log</h3>
        {config.showStreak && (
          <div className="flex items-center gap-1">
            <Flame className="size-4 text-orange-500" />
            <span className="text-sm font-bold">{streak}</span>
            <span className="text-[10px] text-muted-foreground">day streak</span>
          </div>
        )}
      </div>

      {/* Weekly blocks */}
      <div className="flex gap-1.5 justify-between">
        {last7Days.map((day) => {
          const isToday = day === todayStr;
          const hasWorkout = workoutDates.has(day);
          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <div
                className={`size-7 rounded-md transition-colors ${
                  isToday
                    ? "bg-blue-500"
                    : hasWorkout
                      ? "bg-green-500"
                      : "bg-muted"
                }`}
              />
              <span className={`text-[9px] ${isToday ? "font-bold" : "text-muted-foreground"}`}>
                {getDayLabel(day)}
              </span>
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Week stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center rounded-lg bg-muted/50 p-1.5">
          <Calendar className="size-3 text-muted-foreground mb-0.5" />
          <span className="text-sm font-bold">{weekStats.workouts}</span>
          <span className="text-[9px] text-muted-foreground">workouts</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-muted/50 p-1.5">
          <Clock className="size-3 text-muted-foreground mb-0.5" />
          <span className="text-sm font-bold">{weekStats.totalMin}</span>
          <span className="text-[9px] text-muted-foreground">minutes</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-muted/50 p-1.5">
          <Zap className="size-3 text-muted-foreground mb-0.5" />
          <span className="text-sm font-bold">{weekStats.totalCal}</span>
          <span className="text-[9px] text-muted-foreground">calories</span>
        </div>
      </div>

      <Separator />

      {/* Recent workouts */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5">
        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Recent Workouts
        </div>
        {recentWorkouts.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between rounded-lg border border-border p-2"
          >
            <div>
              <div className="text-xs font-medium">{w.type}</div>
              <div className="text-[10px] text-muted-foreground">
                {formatDate(w.date)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[9px]">
                {w.durationMin} min
              </Badge>
              <Badge variant="outline" className="text-[9px]">
                {w.calories} cal
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Log button */}
      <Button size="sm" className="w-full" onClick={handleLogWorkout}>
        <Plus className="size-3.5" />
        Log Workout
      </Button>
    </div>
  );
}
