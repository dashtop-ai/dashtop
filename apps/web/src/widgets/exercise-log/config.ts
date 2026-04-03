import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import ExerciseLogWidget from "./index";
import ExerciseLogSettings from "./settings";

export interface ExerciseLogConfig {
  showStreak: boolean;
  unit: "metric" | "imperial";
}

export const manifest: WidgetManifest<ExerciseLogConfig> = {
  type: "exercise-log",
  name: "Exercise Log",
  description: "Track workouts with streaks, weekly view, and activity stats",
  category: "productivity",
  icon: "Activity",
  defaultConfig: {
    showStreak: true,
    unit: "metric",
  },
  defaultSize: { w: 4, h: 5 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 8 },
  tags: ["fitness", "exercise", "log", "streak", "health", "tracking"],
  version: "1.0.0",
};

registerWidget({
  component: ExerciseLogWidget,
  settingsComponent: ExerciseLogSettings,
  manifest,
});
