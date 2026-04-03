"use client";

import { useState } from "react";
import { type WidgetProps } from "../types";
import { type InspirationFeedConfig } from "./config";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Bookmark, ExternalLink } from "lucide-react";

interface FeedItem {
  id: string;
  title: string;
  creator: string;
  likes: number;
  gradient: string;
  tags: string[];
  aspectTall: boolean;
}

const MOCK_FEED: FeedItem[] = [
  {
    id: "1",
    title: "Ethereal Dreams in Code",
    creator: "synthArtist",
    likes: 2847,
    gradient: "from-violet-600 via-purple-500 to-fuchsia-400",
    tags: ["Abstract", "Digital Art"],
    aspectTall: true,
  },
  {
    id: "2",
    title: "Mechanical Garden",
    creator: "neoFlorist",
    likes: 1923,
    gradient: "from-emerald-500 via-teal-400 to-cyan-300",
    tags: ["Steampunk", "Nature"],
    aspectTall: false,
  },
  {
    id: "3",
    title: "Neon Samurai",
    creator: "pixelRonin",
    likes: 4102,
    gradient: "from-red-500 via-pink-500 to-purple-600",
    tags: ["Cyberpunk", "Character"],
    aspectTall: false,
  },
  {
    id: "4",
    title: "Cosmic Library",
    creator: "stellarScribe",
    likes: 3561,
    gradient: "from-indigo-600 via-blue-500 to-sky-300",
    tags: ["Fantasy", "Architecture"],
    aspectTall: true,
  },
  {
    id: "5",
    title: "Chrome Butterfly",
    creator: "metaMorph",
    likes: 1287,
    gradient: "from-zinc-400 via-slate-300 to-blue-200",
    tags: ["3D", "Surreal"],
    aspectTall: false,
  },
  {
    id: "6",
    title: "Sunrise Protocol",
    creator: "dawnCoder",
    likes: 2156,
    gradient: "from-amber-400 via-orange-400 to-rose-500",
    tags: ["Landscape", "Sci-Fi"],
    aspectTall: true,
  },
  {
    id: "7",
    title: "Ghost in the Machine",
    creator: "spectrumDev",
    likes: 5034,
    gradient: "from-cyan-400 via-blue-500 to-indigo-700",
    tags: ["AI Art", "Concept"],
    aspectTall: false,
  },
  {
    id: "8",
    title: "Paper Crane Universe",
    creator: "origamiStudio",
    likes: 982,
    gradient: "from-rose-300 via-pink-200 to-orange-200",
    tags: ["Minimalist", "Illustration"],
    aspectTall: true,
  },
];

function formatLikes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function InspirationFeedWidget({
  config,
}: WidgetProps<InspirationFeedConfig>) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredFeed =
    config.category === "all"
      ? MOCK_FEED
      : MOCK_FEED.filter((item) =>
          item.tags.some(
            (t) => t.toLowerCase().replace(/\s+/g, "-") === config.category
          )
        );

  return (
    <div className="flex flex-col h-full gap-2 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {config.source === "trending"
            ? "Trending"
            : config.source === "new"
              ? "New"
              : "Top Rated"}
        </h3>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          {filteredFeed.length} works
        </Badge>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="columns-2 gap-2 [&>*]:mb-2">
          {filteredFeed.map((item) => {
            const liked = likedIds.has(item.id);
            const saved = savedIds.has(item.id);
            return (
              <div
                key={item.id}
                className="group break-inside-avoid rounded-lg border overflow-hidden bg-card"
              >
                <div
                  className={`relative bg-gradient-to-br ${item.gradient} ${
                    item.aspectTall ? "aspect-[3/4]" : "aspect-video"
                  }`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1 rounded-md bg-black/40 hover:bg-black/60 transition-colors"
                      onClick={() => toggleSave(item.id)}
                    >
                      <Bookmark
                        className={`size-3 ${saved ? "fill-white text-white" : "text-white"}`}
                      />
                    </button>
                    <button className="p-1 rounded-md bg-black/40 hover:bg-black/60 transition-colors">
                      <ExternalLink className="size-3 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-2">
                  <p className="text-xs font-medium truncate">{item.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">
                      @{item.creator}
                    </span>
                    <button
                      className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => toggleLike(item.id)}
                    >
                      <Heart
                        className={`size-3 ${liked ? "fill-red-500 text-red-500" : ""}`}
                      />
                      {formatLikes(item.likes + (liked ? 1 : 0))}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[8px] px-1 py-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
