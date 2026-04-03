import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import MeetingSummarizerWidget from "./index";
import MeetingSummarizerSettings from "./settings";

export interface MeetingSummarizerConfig {
  autoSummarize: boolean;
  includeActionItems: boolean;
}

export const manifest: WidgetManifest<MeetingSummarizerConfig> = {
  type: "meeting-summarizer",
  name: "Meeting Summarizer",
  description: "AI-powered meeting summaries with key points and action items",
  category: "productivity",
  icon: "Mic",
  defaultConfig: {
    autoSummarize: true,
    includeActionItems: true,
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 6 },
  tags: ["meeting", "summary", "ai", "productivity"],
  version: "1.0.0",
};

registerWidget({
  component: MeetingSummarizerWidget,
  settingsComponent: MeetingSummarizerSettings,
  manifest,
});
