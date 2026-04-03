import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import NotesWidget from "./index";
import NotesSettings from "./settings";

export interface NotesConfig {
  content: string;
  fontSize: string;
}

export const manifest: WidgetManifest<NotesConfig> = {
  type: "notes",
  name: "Sticky Notes",
  description: "Quick notes and reminders on your dashboard",
  category: "utility",
  icon: "StickyNote",
  defaultConfig: {
    content: "",
    fontSize: "sm",
  },
  defaultSize: { w: 3, h: 3 },
  minSize: { w: 2, h: 2 },
  maxSize: { w: 6, h: 6 },
  tags: ["notes", "text", "utility", "memo"],
  version: "1.0.0",
};

registerWidget({
  component: NotesWidget,
  settingsComponent: NotesSettings,
  manifest,
});
