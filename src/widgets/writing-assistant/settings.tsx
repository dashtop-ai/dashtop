"use client";

import { type WidgetProps } from "../types";
import { type WritingAssistantConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WritingAssistantSettings({
  config,
  onConfigChange,
}: WidgetProps<WritingAssistantConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tone</Label>
        <Select
          value={config.tone}
          onValueChange={(val) =>
            onConfigChange({
              tone: val as WritingAssistantConfig["tone"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Max Length</Label>
          <span className="text-xs text-muted-foreground">
            {config.maxLength} chars
          </span>
        </div>
        <Slider
          value={[config.maxLength]}
          onValueChange={(val) =>
            onConfigChange({
              maxLength: Array.isArray(val) ? val[0] : val,
            })
          }
          min={100}
          max={2000}
          step={50}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wa-lang">Language</Label>
        <Input
          id="wa-lang"
          value={config.language}
          onChange={(e) => onConfigChange({ language: e.target.value })}
          placeholder="English"
        />
      </div>
    </div>
  );
}
