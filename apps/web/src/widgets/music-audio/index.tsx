"use client";

import { useState } from "react";
import { type WidgetProps } from "../types";
import { type MusicAudioConfig } from "./config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Loader2, Play, Pause, Download } from "lucide-react";

interface MockTrack {
  id: string;
  title: string;
  duration: string;
  genre: string;
  bars: number[];
}

function generateBars(): number[] {
  return Array.from({ length: 24 }, () => Math.random() * 80 + 20);
}

const MOCK_TRACKS: MockTrack[] = [
  {
    id: "1",
    title: "Ambient Forest Rain",
    duration: "0:30",
    genre: "Ambient",
    bars: generateBars(),
  },
  {
    id: "2",
    title: "Synthwave Sunset Drive",
    duration: "0:45",
    genre: "Electronic",
    bars: generateBars(),
  },
  {
    id: "3",
    title: "Mellow Jazz Cafe",
    duration: "1:00",
    genre: "Jazz",
    bars: generateBars(),
  },
  {
    id: "4",
    title: "Lo-fi Study Beats",
    duration: "0:30",
    genre: "Lo-fi",
    bars: generateBars(),
  },
];

export default function MusicAudioWidget({
  config,
}: WidgetProps<MusicAudioConfig>) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tracks, setTracks] = useState<MockTrack[]>(MOCK_TRACKS);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const newTrack: MockTrack = {
        id: Date.now().toString(),
        title: prompt.trim().slice(0, 40),
        duration: `${Math.floor(config.duration / 60)}:${String(config.duration % 60).padStart(2, "0")}`,
        genre: config.genre,
        bars: generateBars(),
      };
      setTracks((prev) => [newTrack, ...prev]);
      setPrompt("");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the music you want..."
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
            <Music className="size-4" />
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
          <Loader2 className="size-3 animate-spin" />
          <span>Composing with {config.model}...</span>
        </div>
      )}

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="space-y-2">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-2.5 hover:bg-accent/50 transition-colors"
            >
              <button
                className="flex-none size-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                onClick={() =>
                  setPlayingId(playingId === track.id ? null : track.id)
                }
              >
                {playingId === track.id ? (
                  <Pause className="size-3.5 text-primary" />
                ) : (
                  <Play className="size-3.5 text-primary ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    {track.genre}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {track.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-end gap-[2px] h-6 flex-none">
                {track.bars.map((height, i) => (
                  <div
                    key={i}
                    className={`w-[3px] rounded-full transition-all ${
                      playingId === track.id
                        ? "bg-primary animate-pulse"
                        : "bg-muted-foreground/30"
                    }`}
                    style={{
                      height: `${height}%`,
                      animationDelay:
                        playingId === track.id ? `${i * 50}ms` : undefined,
                    }}
                  />
                ))}
              </div>

              <button className="flex-none p-1.5 rounded-md hover:bg-accent transition-colors">
                <Download className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
