import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import WritingAssistantWidget from "./index";
import WritingAssistantSettings from "./settings";

export interface WritingAssistantConfig {
  tone: "professional" | "casual" | "academic" | "creative";
  maxLength: number;
  language: string;
}

export const manifest: WidgetManifest<WritingAssistantConfig> = {
  type: "writing-assistant",
  name: "Writing Assistant",
  description: "AI-powered writing tools to rewrite, summarize, expand, and fix grammar",
  category: "ai",
  icon: "PenLine",
  defaultConfig: {
    tone: "professional",
    maxLength: 500,
    language: "English",
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 8 },
  tags: ["writing", "ai", "text", "grammar", "productivity"],
  version: "1.0.0",
};

registerWidget({
  component: WritingAssistantWidget,
  settingsComponent: WritingAssistantSettings,
  manifest,
});
