"use client";

import { useState } from "react";
import {
  Newspaper,
  RefreshCw,
  ExternalLink,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { type WidgetProps } from "../types";
import { type NewsSummaryConfig } from "./config";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  time: string;
  url: string;
  priority: "high" | "medium" | "low";
  aiInsight?: string;
}

// Mock news data — in production this would come from an AI summarization API
const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "OpenAI Launches GPT-5 with Reasoning Chains",
    summary:
      "The latest model shows breakthrough performance on complex reasoning tasks, scoring 92% on graduate-level math benchmarks. Available to API users today.",
    source: "TechCrunch",
    category: "AI & Tech",
    time: "2h ago",
    url: "#",
    priority: "high",
    aiInsight: "This could impact your model comparison widget — consider adding GPT-5 to your comparison set.",
  },
  {
    id: "2",
    title: "Rust 2.0 Released with Async Improvements",
    summary:
      "Major release brings simplified async/await, improved compile times by 40%, and new standard library networking primitives.",
    source: "Hacker News",
    category: "Developer",
    time: "3h ago",
    url: "#",
    priority: "medium",
  },
  {
    id: "3",
    title: "Anthropic Raises $5B Series E at $60B Valuation",
    summary:
      "Largest AI funding round to date, with Google and Spark Capital leading. Funds will go toward scaling Claude infrastructure and safety research.",
    source: "The Verge",
    category: "Startup/Business",
    time: "4h ago",
    url: "#",
    priority: "high",
    aiInsight: "Anthropic's growth signals continued enterprise demand for AI APIs.",
  },
  {
    id: "4",
    title: "Next.js 17 Preview: React Server Actions Overhaul",
    summary:
      "Vercel previews the next major release with simplified server actions, built-in caching layer, and 50% faster cold starts.",
    source: "Hacker News",
    category: "Developer",
    time: "5h ago",
    url: "#",
    priority: "medium",
  },
  {
    id: "5",
    title: "EU AI Act Enforcement Begins — First Fines Issued",
    summary:
      "Three companies fined for non-compliant AI systems. New transparency requirements now active for high-risk AI applications.",
    source: "Ars Technica",
    category: "AI & Tech",
    time: "6h ago",
    url: "#",
    priority: "high",
  },
  {
    id: "6",
    title: "Figma Acquires AI Design Startup for $400M",
    summary:
      "The acquisition brings AI-powered layout generation and design-to-code capabilities directly into Figma's platform.",
    source: "TechCrunch",
    category: "Startup/Business",
    time: "7h ago",
    url: "#",
    priority: "low",
  },
  {
    id: "7",
    title: "New Study: LLMs Can Now Generate Production-Quality Unit Tests",
    summary:
      "Research from MIT shows AI-generated tests match or exceed human-written tests in 78% of cases across 12 programming languages.",
    source: "MIT Tech Review",
    category: "AI & Tech",
    time: "8h ago",
    url: "#",
    priority: "medium",
    aiInsight: "Relevant to your task automation workflows — AI testing could reduce QA time.",
  },
  {
    id: "8",
    title: "Stripe Launches AI-Powered Fraud Detection v3",
    summary:
      "New system reduces false positives by 60% using transformer models trained on Stripe's transaction data.",
    source: "The Verge",
    category: "Startup/Business",
    time: "9h ago",
    url: "#",
    priority: "low",
  },
];

const PRIORITY_STYLES = {
  high: "bg-red-500/10 text-red-700 border-red-200",
  medium: "bg-amber-500/10 text-amber-700 border-amber-200",
  low: "bg-green-500/10 text-green-700 border-green-200",
};

const CATEGORY_COLORS: Record<string, string> = {
  "AI & Tech": "bg-violet-100 text-violet-700",
  Developer: "bg-blue-100 text-blue-700",
  "Startup/Business": "bg-emerald-100 text-emerald-700",
};

export default function NewsSummaryWidget({
  config,
}: WidgetProps<NewsSummaryConfig>) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  // Filter by active category and configured sources
  const filteredNews = MOCK_NEWS.filter((item) => {
    if (activeCategory && item.category !== activeCategory) return false;
    if (config.sources.length > 0 && !config.sources.includes(item.source))
      return false;
    if (
      config.categories.length > 0 &&
      !config.categories.includes(item.category)
    )
      return false;
    return true;
  }).slice(0, config.maxItems);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <div>
            <span className="text-sm font-semibold">Daily Digest</span>
            <span className="text-xs text-muted-foreground ml-2">{dateStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {config.refreshTime}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-1 px-3 py-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-xs px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
            !activeCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {config.categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
            className={`text-xs px-2 py-0.5 rounded-full transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News items */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {filteredNews.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="px-3 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                {/* Title row */}
                <div className="flex items-start gap-2">
                  <div
                    className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      item.priority === "high"
                        ? "bg-red-500"
                        : item.priority === "medium"
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {config.showSources && (
                        <span className="text-xs text-muted-foreground">
                          {item.source}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 ${CATEGORY_COLORS[item.category] || ""}`}
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-muted-foreground mt-1 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mt-1 flex-shrink-0" />
                  )}
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-2 ml-3.5 space-y-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.summary}
                    </p>

                    {item.aiInsight && (
                      <div className="flex items-start gap-1.5 p-2 rounded-md bg-violet-50 dark:bg-violet-950/20">
                        <Star className="h-3 w-3 text-violet-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-violet-700 dark:text-violet-300">
                          {item.aiInsight}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Read full article
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Newspaper className="h-8 w-8 mb-2" />
            <p className="text-sm">No news for this filter</p>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {filteredNews.filter((n) => n.priority === "high").length} high
          priority
        </span>
        <span>
          {config.sources.length} source{config.sources.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
