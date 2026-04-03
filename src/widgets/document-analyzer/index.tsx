"use client";

import { useState } from "react";
import { type WidgetProps } from "../types";
import { type DocumentAnalyzerConfig } from "./config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Upload,
  Sparkles,
  Building2,
  User,
  MapPin,
  DollarSign,
  ThumbsUp,
} from "lucide-react";

interface AnalyzedDocument {
  title: string;
  pages: number;
  summary: string;
  entities: { type: string; value: string; icon: typeof Building2 }[];
  sentiment: { label: string; score: number };
  tables: number;
}

const MOCK_DOCUMENT: AnalyzedDocument = {
  title: "Q1 2026 Financial Report - Acme Corp",
  pages: 24,
  summary:
    "Quarterly financial performance report showing 18% YoY revenue growth driven by SaaS subscriptions. Operating margins improved by 3.2 points. Key risks include supply chain disruptions and currency fluctuations. Board recommends continued investment in AI product features.",
  entities: [
    { type: "Organization", value: "Acme Corp", icon: Building2 },
    { type: "Person", value: "James Mitchell, CEO", icon: User },
    { type: "Person", value: "Karen Liu, CFO", icon: User },
    { type: "Location", value: "San Francisco, CA", icon: MapPin },
    { type: "Financial", value: "$42.5M Revenue", icon: DollarSign },
    { type: "Financial", value: "$8.2M Net Income", icon: DollarSign },
  ],
  sentiment: { label: "Positive", score: 0.78 },
  tables: 6,
};

export default function DocumentAnalyzerWidget({
  config,
}: WidgetProps<DocumentAnalyzerConfig>) {
  const [analyzed, setAnalyzed] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full p-3 gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <span className="text-sm font-semibold">Document Analyzer</span>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-2">
          {/* Upload Zone */}
          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 hover:bg-accent/30 transition-colors cursor-pointer">
            <Upload className="size-6 mx-auto text-muted-foreground mb-1.5" />
            <div className="text-xs font-medium">
              Drop a document here or click to upload
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              PDF, DOCX, TXT up to 10MB
            </div>
          </div>

          {analyzed && (
            <>
              {/* Document Header */}
              <div className="rounded-lg border bg-card p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium">
                      {MOCK_DOCUMENT.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {MOCK_DOCUMENT.pages} pages
                      {config.extractTables &&
                        ` | ${MOCK_DOCUMENT.tables} tables detected`}
                    </div>
                  </div>
                  <Badge variant="secondary">Analyzed</Badge>
                </div>

                {/* Summary */}
                {config.summarize && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium flex items-center gap-1">
                      <Sparkles className="size-3 text-primary" />
                      AI Summary
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {MOCK_DOCUMENT.summary}
                    </p>
                  </div>
                )}

                {/* Entities */}
                <div className="space-y-1.5">
                  <div className="text-xs font-medium">Key Entities</div>
                  <div className="flex flex-wrap gap-1.5">
                    {MOCK_DOCUMENT.entities.map((entity, i) => {
                      const Icon = entity.icon;
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium"
                        >
                          <Icon className="size-2.5" />
                          {entity.value}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Sentiment */}
                <div className="space-y-1">
                  <div className="text-xs font-medium">Document Sentiment</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{
                          width: `${MOCK_DOCUMENT.sentiment.score * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <ThumbsUp className="size-3" />
                      {MOCK_DOCUMENT.sentiment.label} (
                      {Math.round(MOCK_DOCUMENT.sentiment.score * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {!analyzed && (
            <div className="flex justify-center pt-2">
              <Button
                size="sm"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                <Sparkles className="size-3.5" />
                {isAnalyzing ? "Analyzing..." : "Analyze Document"}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
