import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import TaskAutomationWidget from "./index";
import TaskAutomationSettings from "./settings";

export interface TaskAutomationConfig {
  maxConcurrent: number;
}

export const manifest: WidgetManifest<TaskAutomationConfig> = {
  type: "task-automation",
  name: "Task Automation",
  description: "Manage and monitor AI-powered automation workflows",
  category: "productivity",
  icon: "Zap",
  defaultConfig: {
    maxConcurrent: 3,
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 6 },
  tags: ["automation", "workflow", "ai", "tasks"],
  version: "1.0.0",
};

registerWidget({
  component: TaskAutomationWidget,
  settingsComponent: TaskAutomationSettings,
  manifest,
});
