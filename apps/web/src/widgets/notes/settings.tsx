"use client";

import { type WidgetProps } from "../types";
import { type NotesConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NotesSettings({
  config,
  onConfigChange,
}: WidgetProps<NotesConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Font Size</Label>
        <Select
          value={config.fontSize}
          onValueChange={(value) => value && onConfigChange({ fontSize: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
