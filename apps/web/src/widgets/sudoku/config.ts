import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import SudokuWidget from "./index";
import SudokuSettings from "./settings";

export interface SudokuConfig {
  difficulty: "easy" | "medium" | "hard";
  showTimer: boolean;
  highlightErrors: boolean;
}

export const manifest: WidgetManifest<SudokuConfig> = {
  type: "sudoku",
  name: "Sudoku",
  description: "A fully playable Sudoku puzzle game with multiple difficulty levels",
  category: "utility",
  icon: "Grid3x3",
  defaultConfig: {
    difficulty: "easy",
    showTimer: true,
    highlightErrors: true,
  },
  defaultSize: { w: 4, h: 5 },
  minSize: { w: 3, h: 4 },
  maxSize: { w: 6, h: 7 },
  tags: ["sudoku", "game", "puzzle", "mind games"],
  version: "1.0.0",
};

registerWidget({
  component: SudokuWidget,
  settingsComponent: SudokuSettings,
  manifest,
});
