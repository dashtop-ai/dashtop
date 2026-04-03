"use client";

import { useState } from "react";
import { KeyRound, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { type WidgetProps } from "../types";
import { type ApiKeyManagerConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApiKey {
  id: string;
  provider: string;
  maskedKey: string;
  fullKey: string;
  status: "active" | "expired" | "revoked";
  lastUsed: string;
}

const INITIAL_KEYS: ApiKey[] = [
  {
    id: "1",
    provider: "OpenAI",
    maskedKey: "sk-proj-...8xK4",
    fullKey: "sk-proj-abc123def456ghi789jkl012mno345pqr678xK4",
    status: "active",
    lastUsed: "2 hours ago",
  },
  {
    id: "2",
    provider: "Anthropic",
    maskedKey: "sk-ant-...mR7z",
    fullKey: "sk-ant-xyz987wvu654tsr321qpo098nml765kjimR7z",
    status: "active",
    lastUsed: "5 minutes ago",
  },
  {
    id: "3",
    provider: "Google AI",
    maskedKey: "AIza...Qw9p",
    fullKey: "AIzaSyB1234567890abcdefghijklmnopQw9p",
    status: "expired",
    lastUsed: "3 days ago",
  },
  {
    id: "4",
    provider: "Mistral",
    maskedKey: "mist-...vL2n",
    fullKey: "mist-abc123def456ghi789jklmnovL2n",
    status: "active",
    lastUsed: "1 day ago",
  },
];

const STATUS_CONFIG = {
  active: {
    color: "bg-green-500",
    label: "Active",
    variant: "secondary" as const,
  },
  expired: {
    color: "bg-red-500",
    label: "Expired",
    variant: "destructive" as const,
  },
  revoked: {
    color: "bg-yellow-500",
    label: "Revoked",
    variant: "outline" as const,
  },
};

export default function ApiKeyManagerWidget(
  _props: WidgetProps<ApiKeyManagerConfig>
) {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleAdd = () => {
    const providers = ["Cohere", "Replicate", "Perplexity", "Together AI"];
    const provider =
      providers[Math.floor(Math.random() * providers.length)];
    const newKey: ApiKey = {
      id: Date.now().toString(),
      provider,
      maskedKey: "sk-new-...aB3c",
      fullKey: "sk-new-demo-key-" + Math.random().toString(36).slice(2, 18),
      status: "active",
      lastUsed: "Just now",
    };
    setKeys((prev) => [...prev, newKey]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-primary" />
          <span className="text-sm font-medium">API Keys</span>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={handleAdd}>
          <Plus className="size-3.5" />
        </Button>
      </div>

      {/* Key List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-2">
          {keys.map((key) => {
            const statusCfg = STATUS_CONFIG[key.status];
            const isRevealed = revealedIds.has(key.id);

            return (
              <div
                key={key.id}
                className="group rounded-lg border border-border p-2.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-2 rounded-full ${statusCfg.color}`}
                    />
                    <span className="text-sm font-medium">{key.provider}</span>
                  </div>
                  <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono text-muted-foreground bg-muted/50 rounded px-2 py-1 truncate">
                    {isRevealed ? key.fullKey : key.maskedKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => toggleReveal(key.id)}
                  >
                    {isRevealed ? (
                      <EyeOff className="size-3" />
                    ) : (
                      <Eye className="size-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDelete(key.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>

                <div className="mt-1.5 text-xs text-muted-foreground">
                  Last used: {key.lastUsed}
                </div>
              </div>
            );
          })}

          {keys.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No API keys configured. Click + to add one.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
