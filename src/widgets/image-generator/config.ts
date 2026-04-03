import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import ImageGeneratorWidget from "./index";
import ImageGeneratorSettings from "./settings";

export interface ImageGeneratorConfig {
  model: "dall-e-3" | "stable-diffusion" | "midjourney";
  size: "256x256" | "512x512" | "1024x1024";
  style: "vivid" | "natural";
  quality: "standard" | "hd";
}

export const manifest: WidgetManifest<ImageGeneratorConfig> = {
  type: "image-generator",
  name: "Image Generator",
  description: "Generate AI images from text prompts with multiple model options",
  category: "ai",
  icon: "Image",
  defaultConfig: {
    model: "dall-e-3",
    size: "1024x1024",
    style: "vivid",
    quality: "standard",
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 8 },
  tags: ["image", "ai", "generation", "art", "creative"],
  version: "1.0.0",
};

registerWidget({
  component: ImageGeneratorWidget,
  settingsComponent: ImageGeneratorSettings,
  manifest,
});
