import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import QuizMeWidget from "./index";
import QuizMeSettings from "./settings";

export interface QuizMeConfig {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
}

export const manifest: WidgetManifest<QuizMeConfig> = {
  type: "quiz-me",
  name: "Quiz Me",
  description: "Test your knowledge with AI-generated quiz questions on any topic",
  category: "ai",
  icon: "HelpCircle",
  defaultConfig: {
    topic: "Science",
    difficulty: "medium",
    questionCount: 5,
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 8 },
  tags: ["quiz", "learn", "education", "test", "knowledge", "ai"],
  version: "1.0.0",
};

registerWidget({
  component: QuizMeWidget,
  settingsComponent: QuizMeSettings,
  manifest,
});
