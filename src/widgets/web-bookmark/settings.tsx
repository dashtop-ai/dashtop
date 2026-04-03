"use client";

import { type WidgetProps } from "../types";
import { type WebBookmarkConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function WebBookmarkSettings({
  config,
  onConfigChange,
}: WidgetProps<WebBookmarkConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bm-title">Title</Label>
        <Input
          id="bm-title"
          value={config.title}
          onChange={(e) => onConfigChange({ title: e.target.value })}
          placeholder="My Bookmark"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bm-url">URL</Label>
        <Input
          id="bm-url"
          value={config.url}
          onChange={(e) => onConfigChange({ url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bm-desc">Description</Label>
        <Input
          id="bm-desc"
          value={config.description}
          onChange={(e) => onConfigChange({ description: e.target.value })}
          placeholder="A short description"
        />
      </div>
    </div>
  );
}
