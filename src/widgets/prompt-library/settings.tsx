"use client";

import { type WidgetProps } from "../types";
import { type PromptLibraryConfig } from "./config";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PromptLibrarySettings({
  config,
  onConfigChange,
}: WidgetProps<PromptLibraryConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Default Category</Label>
        <Select
          value={config.category}
          onValueChange={(val) => val && onConfigChange({ category: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="coding">Coding</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={config.sortBy}
          onValueChange={(val) => val && onConfigChange({ sortBy: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="alpha">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
