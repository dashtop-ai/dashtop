import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import AiChatWidget from "./index";
import AiChatSettings from "./settings";

export interface AiChatConfig {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  streamResponses: boolean;
}

export const manifest: WidgetManifest<AiChatConfig> = {
  type: "ai-chat",
  name: "AI Chat",
  description: "Interactive chat interface with configurable AI models",
  category: "ai",
  icon: "MessageSquare",
  defaultConfig: {
    model: "gpt-4",
    systemPrompt: "You are a helpful assistant.",
    temperature: 0.7,
    maxTokens: 2048,
    streamResponses: true,
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 8 },
  tags: ["ai", "chat", "llm", "conversation"],
  version: "1.0.0",
};

registerWidget({
  component: AiChatWidget,
  settingsComponent: AiChatSettings,
  manifest,
});
