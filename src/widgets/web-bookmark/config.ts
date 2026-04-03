import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import WebBookmarkWidget from "./index";
import WebBookmarkSettings from "./settings";

export interface WebBookmarkConfig {
  url: string;
  title: string;
  description: string;
  iconUrl: string;
}

export const manifest: WidgetManifest<WebBookmarkConfig> = {
  type: "web-bookmark",
  name: "Web Bookmark",
  description: "Quick link to any website with title and description",
  category: "utility",
  icon: "Globe",
  defaultConfig: {
    url: "",
    title: "New Bookmark",
    description: "",
    iconUrl: "",
  },
  defaultSize: { w: 3, h: 2 },
  minSize: { w: 2, h: 2 },
  maxSize: { w: 6, h: 3 },
  tags: ["bookmark", "link", "web", "utility"],
  version: "1.0.0",
};

registerWidget({
  component: WebBookmarkWidget,
  settingsComponent: WebBookmarkSettings,
  manifest,
});
