import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import ModelComparisonWidget from "./index";
import ModelComparisonSettings from "./settings";

export interface ModelComparisonConfig {
  models: string[];
  prompt: string;
}

export const manifest: WidgetManifest<ModelComparisonConfig> = {
  type: "model-comparison",
  name: "Model Comparison",
  description:
    "Compare responses from multiple AI models side by side",
  category: "ai",
  icon: "GitCompareArrows",
  defaultConfig: {
    models: ["gpt-4", "claude-3", "gemini-pro"],
    prompt: "",
  },
  defaultSize: { w: 6, h: 4 },
  minSize: { w: 4, h: 3 },
  maxSize: { w: 12, h: 6 },
  tags: ["ai", "comparison", "models", "benchmarks"],
  version: "1.0.0",
};

registerWidget({
  component: ModelComparisonWidget,
  settingsComponent: ModelComparisonSettings,
  manifest,
});
