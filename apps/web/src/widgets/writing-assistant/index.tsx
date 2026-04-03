"use client";

import { useState } from "react";
import { type WidgetProps } from "../types";
import { type WritingAssistantConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RefreshCw,
  AlignLeft,
  Expand,
  CheckCheck,
  Loader2,
  Copy,
  ArrowDown,
} from "lucide-react";

type ActionType = "rewrite" | "summarize" | "expand" | "grammar";

const MOCK_OUTPUTS: Record<ActionType, string> = {
  rewrite:
    "The implementation leverages advanced natural language processing techniques to deliver transformative text modifications. Our approach ensures that the core meaning is preserved while enhancing clarity, readability, and overall impact of the written content.",
  summarize:
    "AI-powered text transformation tool that rewrites, summarizes, expands, and corrects grammar while preserving meaning.",
  expand:
    "The implementation leverages advanced natural language processing techniques to deliver transformative text modifications. By utilizing state-of-the-art language models, the system analyzes the semantic structure, identifies areas for improvement, and generates refined alternatives. Our approach ensures that the core meaning is preserved while enhancing clarity, readability, and overall impact of the written content. Furthermore, the tool adapts its output based on the selected tone, whether professional, casual, academic, or creative, providing versatile assistance for any writing context.",
  grammar:
    "The implementation leverages advanced natural language processing techniques to deliver transformative text modifications. Our approach ensures that the core meaning is preserved while enhancing clarity, readability, and overall impact of the written content.",
};

const ACTIONS: { type: ActionType; label: string; icon: typeof RefreshCw }[] = [
  { type: "rewrite", label: "Rewrite", icon: RefreshCw },
  { type: "summarize", label: "Summarize", icon: AlignLeft },
  { type: "expand", label: "Expand", icon: Expand },
  { type: "grammar", label: "Fix Grammar", icon: CheckCheck },
];

export default function WritingAssistantWidget({
  config,
}: WidgetProps<WritingAssistantConfig>) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (action: ActionType) => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setActiveAction(action);

    setTimeout(() => {
      setOutput(MOCK_OUTPUTS[action]);
      setIsProcessing(false);
    }, 1200);
  };

  const charCount = input.length;
  const isOverLimit = charCount > config.maxLength;

  return (
    <div className="flex flex-col h-full gap-2 p-3">
      <div className="relative flex-1 min-h-0">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here..."
          className="h-full resize-none text-sm"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <span
            className={`text-[10px] ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
          >
            {charCount}/{config.maxLength}
          </span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {config.tone}
          </Badge>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {ACTIONS.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant={activeAction === type ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs gap-1.5 px-2.5"
            onClick={() => handleAction(type)}
            disabled={isProcessing || !input.trim()}
          >
            {isProcessing && activeAction === type ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Icon className="size-3" />
            )}
            {label}
          </Button>
        ))}
      </div>

      {(output || isProcessing) && (
        <>
          <div className="flex items-center gap-2">
            <ArrowDown className="size-3 text-muted-foreground" />
            <Separator className="flex-1" />
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="rounded-lg border bg-muted/50 p-3">
              {isProcessing ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Processing with {config.tone} tone...</span>
                </div>
              ) : (
                <div className="relative group">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {output}
                  </p>
                  <button
                    className="absolute top-0 right-0 p-1 rounded-md bg-background/80 border opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => navigator.clipboard?.writeText(output)}
                  >
                    <Copy className="size-3 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
