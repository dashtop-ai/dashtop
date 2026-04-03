import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import PromptLibraryWidget from "./index";
import PromptLibrarySettings from "./settings";

export interface PromptLibraryConfig {
  category: string;
  sortBy: string;
}

export const manifest: WidgetManifest<PromptLibraryConfig> = {
  type: "prompt-library",
  name: "Prompt Library",
  description: "Browse and manage your saved AI prompts by category",
  category: "ai",
  icon: "BookOpen",
  defaultConfig: {
    category: "all",
    sortBy: "recent",
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 6 },
  tags: ["ai", "prompts", "library", "templates"],
  version: "1.0.0",
};

registerWidget({
  component: PromptLibraryWidget,
  settingsComponent: PromptLibrarySettings,
  manifest,
});
