import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import UsageAnalyticsWidget from "./index";
import UsageAnalyticsSettings from "./settings";

export interface UsageAnalyticsConfig {
  timeRange: string;
  showCost: boolean;
}

export const manifest: WidgetManifest<UsageAnalyticsConfig> = {
  type: "usage-analytics",
  name: "Usage Analytics",
  description: "Track your AI token usage, costs, and daily trends",
  category: "analytics",
  icon: "BarChart3",
  defaultConfig: {
    timeRange: "7d",
    showCost: true,
  },
  defaultSize: { w: 5, h: 3 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 5 },
  tags: ["ai", "analytics", "usage", "tokens", "cost"],
  version: "1.0.0",
};

registerWidget({
  component: UsageAnalyticsWidget,
  settingsComponent: UsageAnalyticsSettings,
  manifest,
});
