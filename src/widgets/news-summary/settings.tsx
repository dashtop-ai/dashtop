"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { type WidgetProps } from "../types";
import { type NewsSummaryConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SUGGESTED_SOURCES = [
  "TechCrunch",
  "Hacker News",
  "The Verge",
  "Ars Technica",
  "MIT Tech Review",
  "Wired",
  "Bloomberg Tech",
  "The Information",
  "Protocol",
  "Axios",
  "Reuters Tech",
  "VentureBeat",
];

const AVAILABLE_CATEGORIES = [
  "AI & Tech",
  "Developer",
  "Startup/Business",
  "Science",
  "Crypto/Web3",
  "Cybersecurity",
  "Gaming",
  "Hardware",
];

export default function NewsSummarySettings({
  config,
  onConfigChange,
}: WidgetProps<NewsSummaryConfig>) {
  const [newSource, setNewSource] = useState("");

  const addSource = (source: string) => {
    if (source && !config.sources.includes(source)) {
      onConfigChange({ sources: [...config.sources, source] });
    }
    setNewSource("");
  };

  const removeSource = (source: string) => {
    onConfigChange({
      sources: config.sources.filter((s) => s !== source),
    });
  };

  const toggleCategory = (category: string) => {
    if (config.categories.includes(category)) {
      onConfigChange({
        categories: config.categories.filter((c) => c !== category),
      });
    } else {
      onConfigChange({ categories: [...config.categories, category] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Sources */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">News Sources</Label>
        <div className="flex flex-wrap gap-1.5">
          {config.sources.map((source) => (
            <Badge
              key={source}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {source}
              <button
                onClick={() => removeSource(source)}
                className="ml-0.5 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Input
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Add source..."
            className="h-7 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSource(newSource);
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => addSource(newSource)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {SUGGESTED_SOURCES.filter((s) => !config.sources.includes(s)).map(
            (source) => (
              <button
                key={source}
                onClick={() => addSource(source)}
                className="text-[10px] px-1.5 py-0.5 rounded border hover:bg-muted transition-colors"
              >
                + {source}
              </button>
            )
          )}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Categories</Label>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                config.categories.includes(cat)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Schedule */}
      <div className="space-y-2">
        <Label htmlFor="refresh-time" className="text-sm font-medium">
          Daily Refresh Time
        </Label>
        <Input
          id="refresh-time"
          type="time"
          value={config.refreshTime}
          onChange={(e) => onConfigChange({ refreshTime: e.target.value })}
          className="h-8 w-32"
        />
        <p className="text-[10px] text-muted-foreground">
          AI summarizes news from your sources at this time daily
        </p>
      </div>

      {/* Max items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Max Items</Label>
          <span className="text-xs text-muted-foreground">
            {config.maxItems}
          </span>
        </div>
        <Slider
          value={[config.maxItems]}
          onValueChange={(v) => onConfigChange({ maxItems: Array.isArray(v) ? v[0] : v })}
          min={3}
          max={20}
          step={1}
        />
      </div>

      <Separator />

      {/* Toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-sources" className="text-sm">
            Show source names
          </Label>
          <Switch
            id="show-sources"
            checked={config.showSources}
            onCheckedChange={(checked) =>
              onConfigChange({ showSources: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-refresh" className="text-sm">
            Auto-refresh daily
          </Label>
          <Switch
            id="auto-refresh"
            checked={config.autoRefresh}
            onCheckedChange={(checked) =>
              onConfigChange({ autoRefresh: checked })
            }
          />
        </div>
      </div>
    </div>
  );
}
