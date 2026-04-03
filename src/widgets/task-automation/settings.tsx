"use client";

import { type WidgetProps } from "../types";
import { type TaskAutomationConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function TaskAutomationSettings({
  config,
  onConfigChange,
}: WidgetProps<TaskAutomationConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Max concurrent automations</Label>
          <span className="text-sm font-medium tabular-nums">
            {config.maxConcurrent}
          </span>
        </div>
        <Slider
          min={1}
          max={10}
          value={[config.maxConcurrent]}
          onValueChange={(value) =>
            onConfigChange({
              maxConcurrent: Array.isArray(value) ? value[0] : value,
            })
          }
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
