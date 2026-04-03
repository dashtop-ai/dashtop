"use client";

import { useState } from "react";
import { type WidgetProps } from "../types";
import { type StylePresetsConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Plus } from "lucide-react";

interface StylePreset {
  id: string;
  name: string;
  gradient: string;
  tags: string[];
}

const MOCK_PRESETS: StylePreset[] = [
  {
    id: "1",
    name: "Cyberpunk Neon",
    gradient: "from-fuchsia-600 via-purple-600 to-cyan-400",
    tags: ["Cyberpunk", "Neon", "Sci-Fi"],
  },
  {
    id: "2",
    name: "Watercolor Dream",
    gradient: "from-rose-300 via-sky-200 to-teal-200",
    tags: ["Watercolor", "Soft", "Organic"],
  },
  {
    id: "3",
    name: "Minimalist Mono",
    gradient: "from-zinc-200 via-zinc-400 to-zinc-800",
    tags: ["Minimalist", "Clean", "Modern"],
  },
  {
    id: "4",
    name: "Art Deco Gold",
    gradient: "from-amber-400 via-yellow-500 to-amber-700",
    tags: ["Art Deco", "Luxury", "Retro"],
  },
  {
    id: "5",
    name: "Vaporwave Sunset",
    gradient: "from-pink-400 via-violet-500 to-indigo-600",
    tags: ["Vaporwave", "Retro", "Aesthetic"],
  },
  {
    id: "6",
    name: "Forest Depths",
    gradient: "from-green-800 via-emerald-600 to-lime-400",
    tags: ["Nature", "Dark", "Organic"],
  },
  {
    id: "7",
    name: "Pastel Pop",
    gradient: "from-pink-200 via-purple-200 to-blue-200",
    tags: ["Pastel", "Cute", "Soft"],
  },
  {
    id: "8",
    name: "Lava Flow",
    gradient: "from-red-700 via-orange-500 to-yellow-400",
    tags: ["Warm", "Intense", "Dynamic"],
  },
  {
    id: "9",
    name: "Arctic Aurora",
    gradient: "from-teal-300 via-blue-500 to-violet-600",
    tags: ["Cold", "Northern Lights", "Ethereal"],
  },
];

export default function StylePresetsWidget({
  config,
}: WidgetProps<StylePresetsConfig>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Style Presets</h3>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
          <Plus className="size-3" />
          Add Preset
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="grid grid-cols-3 gap-2">
          {MOCK_PRESETS.map((preset) => {
            const isActive = activeId === preset.id;
            return (
              <button
                key={preset.id}
                className={`relative flex flex-col rounded-lg border overflow-hidden text-left transition-all hover:ring-2 hover:ring-primary/50 ${
                  isActive
                    ? "ring-2 ring-primary border-primary"
                    : "border-border"
                }`}
                onClick={() => setActiveId(isActive ? null : preset.id)}
              >
                <div
                  className={`h-16 bg-gradient-to-br ${preset.gradient} relative`}
                >
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="size-3 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-1.5">
                  <p className="text-[11px] font-medium truncate">
                    {preset.name}
                  </p>
                  {config.showTags && (
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {preset.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[8px] px-1 py-0 leading-tight"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
