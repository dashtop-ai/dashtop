"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dumbbell,
  Heart,
  Zap,
  Target,
  Timer,
  CheckCircle2,
  Circle,
  Play,
  Square,
  PartyPopper,
} from "lucide-react";
import { type WidgetProps } from "../types";
import { type WorkoutPlannerConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string; // number or duration string like "30s"
  muscleGroup: string;
  icon: keyof typeof muscleIcons;
}

const muscleIcons = {
  chest: Dumbbell,
  legs: Zap,
  back: Target,
  core: Heart,
  shoulders: Dumbbell,
  arms: Zap,
} as const;

const MOCK_EXERCISES: Exercise[] = [
  { id: "1", name: "Barbell Squats", sets: 3, reps: 12, muscleGroup: "Legs", icon: "legs" },
  { id: "2", name: "Bench Press", sets: 3, reps: 10, muscleGroup: "Chest", icon: "chest" },
  { id: "3", name: "Bent-Over Rows", sets: 3, reps: 10, muscleGroup: "Back", icon: "back" },
  { id: "4", name: "Overhead Press", sets: 3, reps: 8, muscleGroup: "Shoulders", icon: "shoulders" },
  { id: "5", name: "Plank Hold", sets: 3, reps: "45s", muscleGroup: "Core", icon: "core" },
  { id: "6", name: "Bicep Curls", sets: 3, reps: 12, muscleGroup: "Arms", icon: "arms" },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function WorkoutPlannerWidget({
  config,
}: WidgetProps<WorkoutPlannerConfig>) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const toggleExercise = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const allDone = completed.size === MOCK_EXERCISES.length;
  const progressPercent = (completed.size / MOCK_EXERCISES.length) * 100;

  const handleStartStop = () => {
    if (allDone) return;
    setTimerRunning((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-full gap-3 p-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Full Body Strength</h3>
          <p className="text-[10px] text-muted-foreground">
            {config.fitnessLevel} &middot; {config.duration} min
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
            <Timer className="size-3" />
            {formatTime(elapsedSeconds)}
          </div>
          <Button
            variant={timerRunning ? "destructive" : "default"}
            size="xs"
            onClick={handleStartStop}
            disabled={allDone}
          >
            {timerRunning ? (
              <>
                <Square className="size-3" />
                Stop
              </>
            ) : (
              <>
                <Play className="size-3" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Progress</span>
          <span>{completed.size}/{MOCK_EXERCISES.length} exercises</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <Separator />

      {/* Celebration or exercise list */}
      {allDone ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center">
          <PartyPopper className="size-8 text-primary" />
          <h4 className="text-sm font-semibold">Workout Complete!</h4>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Time: {formatTime(elapsedSeconds)}</p>
            <p>{MOCK_EXERCISES.length} exercises finished</p>
            <p>Goal: {config.goal}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
          {MOCK_EXERCISES.map((exercise) => {
            const done = completed.has(exercise.id);
            const IconComponent = muscleIcons[exercise.icon] || Dumbbell;
            return (
              <button
                key={exercise.id}
                onClick={() => toggleExercise(exercise.id)}
                className={`flex items-center gap-2 w-full rounded-lg border p-2 text-left transition-colors ${
                  done
                    ? "bg-muted/50 border-primary/20 opacity-60"
                    : "hover:bg-muted/50 border-border"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                ) : (
                  <Circle className="size-4 shrink-0 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium ${done ? "line-through" : ""}`}>
                    {exercise.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {exercise.sets} x {exercise.reps}
                  </div>
                </div>
                <Badge variant="secondary" className="text-[9px] shrink-0">
                  <IconComponent className="size-2.5" />
                  {exercise.muscleGroup}
                </Badge>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
