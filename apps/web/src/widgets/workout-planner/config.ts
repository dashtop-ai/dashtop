import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import WorkoutPlannerWidget from "./index";
import WorkoutPlannerSettings from "./settings";

export interface WorkoutPlannerConfig {
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  goal: "strength" | "cardio" | "flexibility" | "weight-loss";
  duration: number; // minutes
}

export const manifest: WidgetManifest<WorkoutPlannerConfig> = {
  type: "workout-planner",
  name: "Workout Planner",
  description: "Daily workout plan with exercise tracking and timer",
  category: "productivity",
  icon: "Dumbbell",
  defaultConfig: {
    fitnessLevel: "intermediate",
    goal: "strength",
    duration: 45,
  },
  defaultSize: { w: 4, h: 5 },
  minSize: { w: 3, h: 4 },
  maxSize: { w: 8, h: 8 },
  tags: ["fitness", "workout", "exercise", "health", "training"],
  version: "1.0.0",
};

registerWidget({
  component: WorkoutPlannerWidget,
  settingsComponent: WorkoutPlannerSettings,
  manifest,
});
