"use client";

import { useState, useMemo } from "react";
import { Search, Copy, Check, BookOpen } from "lucide-react";
import { type WidgetProps } from "../types";
import { type PromptLibraryConfig } from "./config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  usageCount: number;
  createdAt: Date;
}

const MOCK_PROMPTS: Prompt[] = [
  {
    id: "1",
    title: "Code Review Assistant",
    content:
      "Review the following code for bugs, performance issues, and best practices. Suggest improvements with explanations.",
    category: "Coding",
    usageCount: 47,
    createdAt: new Date("2026-03-28"),
  },
  {
    id: "2",
    title: "Blog Post Outline",
    content:
      "Create a detailed blog post outline about {topic}. Include an engaging introduction, 5-7 main sections with subpoints, and a compelling conclusion.",
    category: "Writing",
    usageCount: 32,
    createdAt: new Date("2026-03-25"),
  },
  {
    id: "3",
    title: "Research Summary",
    content:
      "Summarize the key findings, methodology, and implications of this research paper. Highlight any limitations and suggest follow-up questions.",
    category: "Research",
    usageCount: 28,
    createdAt: new Date("2026-03-30"),
  },
  {
    id: "4",
    title: "Story Idea Generator",
    content:
      "Generate 5 unique story ideas in the {genre} genre. Each idea should include a protagonist, conflict, setting, and a twist.",
    category: "Creative",
    usageCount: 19,
    createdAt: new Date("2026-03-20"),
  },
  {
    id: "5",
    title: "Debug Helper",
    content:
      "I'm encountering the following error: {error}. Help me understand the root cause and provide a step-by-step debugging approach.",
    category: "Coding",
    usageCount: 53,
    createdAt: new Date("2026-04-01"),
  },
  {
    id: "6",
    title: "Email Rewriter",
    content:
      "Rewrite this email to be more {tone} while maintaining the core message. Keep it concise and professional.",
    category: "Writing",
    usageCount: 41,
    createdAt: new Date("2026-03-27"),
  },
  {
    id: "7",
    title: "Data Analysis Plan",
    content:
      "Create an analysis plan for the provided dataset. Include exploratory data analysis steps, statistical tests to run, and visualization recommendations.",
    category: "Research",
    usageCount: 15,
    createdAt: new Date("2026-03-22"),
  },
  {
    id: "8",
    title: "Character Builder",
    content:
      "Create a detailed character profile including backstory, motivations, personality traits, flaws, and speech patterns for a {archetype} character.",
    category: "Creative",
    usageCount: 22,
    createdAt: new Date("2026-03-18"),
  },
];

const CATEGORY_COLORS: Record<string, "default" | "secondary" | "outline"> = {
  Coding: "default",
  Writing: "secondary",
  Research: "outline",
  Creative: "default",
};

export default function PromptLibraryWidget({
  config,
}: WidgetProps<PromptLibraryConfig>) {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let prompts = MOCK_PROMPTS;

    if (config.category !== "all") {
      prompts = prompts.filter(
        (p) => p.category.toLowerCase() === config.category.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      prompts = prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    if (config.sortBy === "popular") {
      prompts = [...prompts].sort((a, b) => b.usageCount - a.usageCount);
    } else if (config.sortBy === "alpha") {
      prompts = [...prompts].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      prompts = [...prompts].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }

    return prompts;
  }, [config.category, config.sortBy, search]);

  const handleCopy = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.content).catch(() => {});
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <BookOpen className="size-4 text-primary" />
        <span className="text-sm font-medium">Prompt Library</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} prompts
        </span>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="pl-8 h-7 text-xs"
          />
        </div>
      </div>

      {/* Prompt List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-3 pb-3 space-y-2">
          {filtered.map((prompt) => (
            <div
              key={prompt.id}
              className="group rounded-lg border border-border p-2.5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium truncate">
                      {prompt.title}
                    </span>
                    <Badge
                      variant={CATEGORY_COLORS[prompt.category] ?? "secondary"}
                    >
                      {prompt.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {prompt.content}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleCopy(prompt)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedId === prompt.id ? (
                    <Check className="size-3 text-green-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                <span>Used {prompt.usageCount} times</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No prompts found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
