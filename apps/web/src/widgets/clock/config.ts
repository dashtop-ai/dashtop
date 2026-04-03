import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import ClockWidget from "./index";
import ClockSettings from "./settings";

export interface ClockConfig {
  format24h: boolean;
  showSeconds: boolean;
  showDate: boolean;
  timezone: string;
}

export const manifest: WidgetManifest<ClockConfig> = {
  type: "clock",
  name: "Clock",
  description: "Displays current time with configurable format and timezone",
  category: "utility",
  icon: "Clock",
  defaultConfig: {
    format24h: false,
    showSeconds: true,
    showDate: true,
    timezone: "local",
  },
  defaultSize: { w: 3, h: 2 },
  minSize: { w: 2, h: 2 },
  maxSize: { w: 6, h: 4 },
  tags: ["clock", "time", "utility"],
  version: "1.0.0",
};

registerWidget({
  component: ClockWidget,
  settingsComponent: ClockSettings,
  manifest,
});
