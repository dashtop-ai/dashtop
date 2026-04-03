import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import StylePresetsWidget from "./index";
import StylePresetsSettings from "./settings";

export interface StylePresetsConfig {
  showTags: boolean;
}

export const manifest: WidgetManifest<StylePresetsConfig> = {
  type: "style-presets",
  name: "Style Presets",
  description: "Browse and apply curated visual style presets for AI generation",
  category: "ai",
  icon: "Palette",
  defaultConfig: {
    showTags: true,
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 8 },
  tags: ["style", "presets", "art", "creative", "design"],
  version: "1.0.0",
};

registerWidget({
  component: StylePresetsWidget,
  settingsComponent: StylePresetsSettings,
  manifest,
});
