"use client";

import { type WidgetProps } from "../types";
import { type MeetingSummarizerConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function MeetingSummarizerSettings({
  config,
  onConfigChange,
}: WidgetProps<MeetingSummarizerConfig>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="autoSummarize">Auto-summarize new meetings</Label>
        <Switch
          id="autoSummarize"
          checked={config.autoSummarize}
          onCheckedChange={(checked) =>
            onConfigChange({ autoSummarize: checked })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="includeActionItems">Include action items</Label>
        <Switch
          id="includeActionItems"
          checked={config.includeActionItems}
          onCheckedChange={(checked) =>
            onConfigChange({ includeActionItems: checked })
          }
        />
      </div>
    </div>
  );
}
