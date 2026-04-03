"use client";

import { type WidgetProps } from "../types";
import { type InspirationFeedConfig } from "./config";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InspirationFeedSettings({
  config,
  onConfigChange,
}: WidgetProps<InspirationFeedConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Source</Label>
        <Select
          value={config.source}
          onValueChange={(val) =>
            onConfigChange({
              source: val as InspirationFeedConfig["source"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="top-rated">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={config.category}
          onValueChange={(val) =>
            onConfigChange({
              category: val as InspirationFeedConfig["category"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="digital-art">Digital Art</SelectItem>
            <SelectItem value="photography">Photography</SelectItem>
            <SelectItem value="3d">3D</SelectItem>
            <SelectItem value="illustration">Illustration</SelectItem>
            <SelectItem value="concept-art">Concept Art</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
