import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import NewsSummaryWidget from "./index";
import NewsSummarySettings from "./settings";

export interface NewsSummaryConfig {
  sources: string[];
  categories: string[];
  refreshTime: string; // "07:00" format
  maxItems: number;
  showSources: boolean;
  autoRefresh: boolean;
}

export const manifest: WidgetManifest<NewsSummaryConfig> = {
  type: "news-summary",
  name: "News Summary",
  description: "AI-curated daily news digest from your favorite sources",
  category: "ai",
  icon: "Newspaper",
  defaultConfig: {
    sources: ["TechCrunch", "Hacker News", "The Verge", "Ars Technica", "MIT Tech Review"],
    categories: ["AI & Tech", "Developer", "Startup/Business"],
    refreshTime: "07:00",
    maxItems: 5,
    showSources: true,
    autoRefresh: true,
  },
  defaultSize: { w: 5, h: 5 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 12, h: 8 },
  tags: ["news", "ai", "summary", "daily", "feed", "tech"],
  version: "1.0.0",
};

registerWidget({
  component: NewsSummaryWidget,
  settingsComponent: NewsSummarySettings,
  manifest,
});
