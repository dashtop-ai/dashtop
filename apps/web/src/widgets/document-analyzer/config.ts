import { registerWidget } from "../registry";
import { type WidgetManifest } from "../types";
import DocumentAnalyzerWidget from "./index";
import DocumentAnalyzerSettings from "./settings";

export interface DocumentAnalyzerConfig {
  extractTables: boolean;
  summarize: boolean;
}

export const manifest: WidgetManifest<DocumentAnalyzerConfig> = {
  type: "document-analyzer",
  name: "Document Analyzer",
  description:
    "AI-powered document analysis with entity extraction and summaries",
  category: "productivity",
  icon: "FileText",
  defaultConfig: {
    extractTables: true,
    summarize: true,
  },
  defaultSize: { w: 4, h: 4 },
  minSize: { w: 3, h: 3 },
  maxSize: { w: 8, h: 6 },
  tags: ["document", "analysis", "ai", "pdf", "extract"],
  version: "1.0.0",
};

registerWidget({
  component: DocumentAnalyzerWidget,
  settingsComponent: DocumentAnalyzerSettings,
  manifest,
});
