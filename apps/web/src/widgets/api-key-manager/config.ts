import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import ApiKeyManagerWidget from "./index";
import ApiKeyManagerSettings from "./settings";

export interface ApiKeyManagerConfig {
  // No user-configurable settings; keys are managed in-widget
}

export const manifest: WidgetManifest<ApiKeyManagerConfig> = {
  type: "api-key-manager",
  name: "API Key Manager",
  description: "Manage and monitor your AI provider API keys",
  category: "utility",
  icon: "KeyRound",
  defaultConfig: {},
  defaultSize: { w: 4, h: 3 },
  minSize: { w: 3, h: 2 },
  maxSize: { w: 6, h: 5 },
  tags: ["ai", "api", "keys", "security"],
  version: "1.0.0",
};

registerWidget({
  component: ApiKeyManagerWidget,
  settingsComponent: ApiKeyManagerSettings,
  manifest,
});
