import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import CalendarAiWidget from "./index";
import CalendarAiSettings from "./settings";

export interface CalendarAiConfig {
  workingHours: { start: number; end: number };
  timezone: string;
}

export const manifest: WidgetManifest<CalendarAiConfig> = {
  type: "calendar-ai",
  name: "Calendar AI",
  description:
    "AI-enhanced weekly calendar with smart scheduling suggestions",
  category: "productivity",
  icon: "CalendarDays",
  defaultConfig: {
    workingHours: { start: 9, end: 17 },
    timezone: "America/New_York",
  },
  defaultSize: { w: 5, h: 4 },
  minSize: { w: 4, h: 3 },
  maxSize: { w: 10, h: 6 },
  tags: ["calendar", "schedule", "ai", "productivity"],
  version: "1.0.0",
};

registerWidget({
  component: CalendarAiWidget,
  settingsComponent: CalendarAiSettings,
  manifest,
});
