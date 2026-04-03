import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import ConceptExplainerWidget from "./index";
import ConceptExplainerSettings from "./settings";

export interface ConceptExplainerConfig {
  level: "beginner" | "intermediate" | "expert";
  style: "eli5" | "textbook" | "analogy";
}

export const manifest: WidgetManifest<ConceptExplainerConfig> = {
  type: "concept-explainer",
  name: "Concept Explainer",
  description: "Type any concept and get a clear, tailored explanation",
  category: "ai",
  icon: "Lightbulb",
  defaultConfig: {
    level: "beginner",
    style: "eli5",
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 8 },
  tags: ["learn", "education", "explain", "concept", "ai"],
  version: "1.0.0",
};

registerWidget({
  component: ConceptExplainerWidget,
  settingsComponent: ConceptExplainerSettings,
  manifest,
});
