"use client";

import { useState } from "react";
import { type WidgetProps } from "../types";
import { type ImageGeneratorConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, Loader2, Download, Maximize2 } from "lucide-react";

interface MockImage {
  id: string;
  prompt: string;
  gradient: string;
  timestamp: string;
}

const MOCK_GALLERY: MockImage[] = [
  {
    id: "1",
    prompt: "A neon-lit cyberpunk cityscape at midnight",
    gradient: "from-purple-600 via-pink-500 to-cyan-400",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    prompt: "Serene mountain lake at golden hour",
    gradient: "from-amber-400 via-orange-300 to-sky-500",
    timestamp: "5 min ago",
  },
  {
    id: "3",
    prompt: "Abstract geometric crystal formation",
    gradient: "from-emerald-500 via-teal-400 to-blue-600",
    timestamp: "12 min ago",
  },
  {
    id: "4",
    prompt: "Floating islands above cloud sea",
    gradient: "from-indigo-500 via-violet-400 to-rose-400",
    timestamp: "18 min ago",
  },
];

export default function ImageGeneratorWidget({
  config,
}: WidgetProps<ImageGeneratorConfig>) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [gallery, setGallery] = useState<MockImage[]>(MOCK_GALLERY);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const gradients = [
        "from-rose-500 via-fuchsia-500 to-indigo-500",
        "from-lime-400 via-emerald-500 to-cyan-500",
        "from-yellow-400 via-red-500 to-pink-500",
        "from-sky-400 via-blue-500 to-violet-600",
      ];
      const newImage: MockImage = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        gradient: gradients[Math.floor(Math.random() * gradients.length)],
        timestamp: "Just now",
      };
      setGallery((prev) => [newImage, ...prev]);
      setPrompt("");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create..."
          className="flex-1 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          disabled={isGenerating}
        />
        <Button
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImageIcon className="size-4" />
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <Loader2 className="size-3 animate-spin" />
          <span>
            Generating with {config.model} ({config.size}, {config.style})...
          </span>
        </div>
      )}

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 gap-2">
          {gallery.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${img.gradient}`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] leading-tight text-white font-medium line-clamp-2">
                  {img.prompt}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-white/70">
                    {img.timestamp}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-0.5 rounded bg-white/20 hover:bg-white/30 transition-colors">
                      <Maximize2 className="size-2.5 text-white" />
                    </button>
                    <button className="p-0.5 rounded bg-white/20 hover:bg-white/30 transition-colors">
                      <Download className="size-2.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="absolute top-1.5 right-1.5 text-[8px] px-1 py-0 bg-black/40 text-white border-0"
              >
                {config.model}
              </Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
