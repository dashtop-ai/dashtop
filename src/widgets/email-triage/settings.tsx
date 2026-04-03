"use client";

import { type WidgetProps } from "../types";
import { type EmailTriageConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EmailTriageSettings({
  config,
  onConfigChange,
}: WidgetProps<EmailTriageConfig>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="autoLabel">Auto-label emails</Label>
        <Switch
          id="autoLabel"
          checked={config.autoLabel}
          onCheckedChange={(checked) => onConfigChange({ autoLabel: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Priority threshold</Label>
        <Select
          value={config.priorityThreshold}
          onValueChange={(value) =>
            onConfigChange({
              priorityThreshold: value as EmailTriageConfig["priorityThreshold"],
            })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="medium">Medium & High</SelectItem>
            <SelectItem value="high">High only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
