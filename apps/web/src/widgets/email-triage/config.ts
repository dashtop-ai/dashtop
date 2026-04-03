import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import EmailTriageWidget from "./index";
import EmailTriageSettings from "./settings";

export interface EmailTriageConfig {
  autoLabel: boolean;
  priorityThreshold: "all" | "high" | "medium";
}

export const manifest: WidgetManifest<EmailTriageConfig> = {
  type: "email-triage",
  name: "Email Triage",
  description: "AI-categorized email inbox with priority and label suggestions",
  category: "productivity",
  icon: "Mail",
  defaultConfig: {
    autoLabel: true,
    priorityThreshold: "all",
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 6 },
  tags: ["email", "triage", "ai", "productivity", "inbox"],
  version: "1.0.0",
};

registerWidget({
  component: EmailTriageWidget,
  settingsComponent: EmailTriageSettings,
  manifest,
});
