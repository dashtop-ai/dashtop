"use client";

import { type WidgetProps } from "../types";
import { type AiChatConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AiChatSettings({
  config,
  onConfigChange,
}: WidgetProps<AiChatConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Model</Label>
        <Select
          value={config.model}
          onValueChange={(val) => val && onConfigChange({ model: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="claude-3">Claude 3</SelectItem>
            <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          Temperature: {config.temperature.toFixed(1)}
        </Label>
        <Slider
          value={[config.temperature]}
          onValueChange={(val) => {
            const v = Array.isArray(val) ? val[0] : val;
            onConfigChange({ temperature: v });
          }}
          min={0}
          max={2}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <Label>System Prompt</Label>
        <Textarea
          value={config.systemPrompt}
          onChange={(e) => onConfigChange({ systemPrompt: e.target.value })}
          placeholder="Enter a system prompt..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="streamResponses">Stream responses</Label>
        <Switch
          id="streamResponses"
          checked={config.streamResponses}
          onCheckedChange={(checked) =>
            onConfigChange({ streamResponses: checked })
          }
        />
      </div>
    </div>
  );
}
