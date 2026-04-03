import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import InspirationFeedWidget from "./index";
import InspirationFeedSettings from "./settings";

export interface InspirationFeedConfig {
  source: "trending" | "new" | "top-rated";
  category: "all" | "digital-art" | "photography" | "3d" | "illustration" | "concept-art";
}

export const manifest: WidgetManifest<InspirationFeedConfig> = {
  type: "inspiration-feed",
  name: "Inspiration Feed",
  description: "Discover trending AI-generated art and creative inspiration",
  category: "ai",
  icon: "Sparkles",
  defaultConfig: {
    source: "trending",
    category: "all",
  },
  defaultSize: { w: 4, h: 5 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 8 },
  tags: ["inspiration", "feed", "art", "trending", "creative"],
  version: "1.0.0",
};

registerWidget({
  component: InspirationFeedWidget,
  settingsComponent: InspirationFeedSettings,
  manifest,
});
