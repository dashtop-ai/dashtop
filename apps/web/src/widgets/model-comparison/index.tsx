"use client";

import { useState, useCallback } from "react";
import { GitCompareArrows, Send, Clock, Zap, Loader2 } from "lucide-react";
import { type WidgetProps } from "../types";
import { type ModelComparisonConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModelResponse {
  model: string;
  label: string;
  response: string;
  responseTime: number;
  tokens: number;
}

const MODEL_LABELS: Record<string, string> = {
  "gpt-4": "GPT-4",
  "claude-3": "Claude 3",
  "gemini-pro": "Gemini Pro",
  "llama-3": "Llama 3",
  "mistral-large": "Mistral Large",
};

const MOCK_RESPONSES: Record<string, { response: string; time: number; tokens: number }> = {
  "gpt-4": {
    response:
      "Here's a concise approach: Start by defining your data structures clearly. Use TypeScript interfaces to enforce type safety at compile time. Implement repository pattern for data access to keep your business logic decoupled from storage concerns. This gives you flexibility to swap backends without touching core logic.",
    time: 1.8,
    tokens: 287,
  },
  "claude-3": {
    response:
      "I'd suggest a layered architecture approach. Begin with clear separation of concerns -- presentation, business logic, and data access layers. Use dependency injection to manage component lifecycles. The key advantage is testability: each layer can be unit tested independently with mock dependencies.",
    time: 1.2,
    tokens: 312,
  },
  "gemini-pro": {
    response:
      "Consider an event-driven architecture for this use case. Events provide natural decoupling between components, making the system more resilient. Combined with CQRS (Command Query Responsibility Segregation), you get optimized read and write paths that scale independently.",
    time: 2.1,
    tokens: 254,
  },
  "llama-3": {
    response:
      "A microservices approach would work well here. Each service handles a specific domain boundary with its own data store. Use message queues for async communication between services. This enables independent deployment and horizontal scaling of individual components.",
    time: 0.9,
    tokens: 198,
  },
  "mistral-large": {
    response:
      "I recommend starting with a modular monolith. It gives you the organizational benefits of microservices with the operational simplicity of a monolith. As the system grows, you can extract modules into independent services based on actual scaling needs rather than predicted ones.",
    time: 1.5,
    tokens: 271,
  },
};

export default function ModelComparisonWidget({
  config,
}: WidgetProps<ModelComparisonConfig>) {
  const [prompt, setPrompt] = useState(config.prompt || "");
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = useCallback(() => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResponses([]);

    // Simulate staggered responses
    const models = config.models.filter((m) => m in MOCK_RESPONSES);
    models.forEach((model, idx) => {
      const mock = MOCK_RESPONSES[model];
      const delay = 600 + idx * 400 + Math.random() * 500;
      setTimeout(() => {
        setResponses((prev) => [
          ...prev,
          {
            model,
            label: MODEL_LABELS[model] ?? model,
            response: mock.response,
            responseTime: mock.time + (Math.random() * 0.4 - 0.2),
            tokens: mock.tokens + Math.round(Math.random() * 40 - 20),
          },
        ]);
        // Turn off loading when last model responds
        if (idx === models.length - 1) {
          setTimeout(() => setIsLoading(false), 100);
        }
      }, delay);
    });
  }, [prompt, config.models, isLoading]);

  const activeModels = config.models.filter((m) => m in MOCK_RESPONSES);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="size-4 text-primary" />
          <span className="text-sm font-medium">Model Comparison</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {activeModels.length} models
        </span>
      </div>

      {/* Prompt Input */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCompare()}
          placeholder="Enter a prompt to compare models..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          size="icon"
          onClick={handleCompare}
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>

      {/* Responses */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3">
          {responses.length === 0 && !isLoading && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Enter a prompt and click send to compare model responses
            </div>
          )}

          <div className="grid gap-2" style={{
            gridTemplateColumns: `repeat(${Math.min(activeModels.length, 3)}, 1fr)`,
          }}>
            {/* Show placeholder cards for loading models that haven't responded */}
            {isLoading &&
              activeModels
                .filter((m) => !responses.find((r) => r.model === m))
                .map((model) => (
                  <div
                    key={model}
                    className="rounded-lg border border-border p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {MODEL_LABELS[model] ?? model}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
                      <Loader2 className="size-3.5 animate-spin" />
                      Generating...
                    </div>
                  </div>
                ))}

            {/* Rendered responses */}
            {responses.map((r) => (
              <div
                key={r.model}
                className="rounded-lg border border-border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{r.label}</Badge>
                </div>
                <p className="text-xs leading-relaxed text-foreground">
                  {r.response}
                </p>
                <div className="flex items-center gap-3 pt-1 border-t border-border text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {r.responseTime.toFixed(1)}s
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="size-3" />
                    {r.tokens} tokens
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
