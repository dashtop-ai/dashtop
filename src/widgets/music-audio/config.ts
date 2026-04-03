import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import MusicAudioWidget from "./index";
import MusicAudioSettings from "./settings";

export interface MusicAudioConfig {
  model: "musicgen" | "audioldm" | "riffusion";
  duration: number;
  genre: "ambient" | "electronic" | "classical" | "jazz" | "rock" | "hip-hop" | "lo-fi";
}

export const manifest: WidgetManifest<MusicAudioConfig> = {
  type: "music-audio",
  name: "Music & Audio",
  description: "Generate music and audio tracks from text descriptions",
  category: "ai",
  icon: "Music",
  defaultConfig: {
    model: "musicgen",
    duration: 30,
    genre: "ambient",
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 6 },
  tags: ["music", "audio", "ai", "generation", "creative"],
  version: "1.0.0",
};

registerWidget({
  component: MusicAudioWidget,
  settingsComponent: MusicAudioSettings,
  manifest,
});
