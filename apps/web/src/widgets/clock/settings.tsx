"use client";

import { type WidgetProps } from "../types";
import { type ClockConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ClockSettings({
  config,
  onConfigChange,
}: WidgetProps<ClockConfig>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="format24h">24-hour format</Label>
        <Switch
          id="format24h"
          checked={config.format24h}
          onCheckedChange={(checked) => onConfigChange({ format24h: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="showSeconds">Show seconds</Label>
        <Switch
          id="showSeconds"
          checked={config.showSeconds}
          onCheckedChange={(checked) => onConfigChange({ showSeconds: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="showDate">Show date</Label>
        <Switch
          id="showDate"
          checked={config.showDate}
          onCheckedChange={(checked) => onConfigChange({ showDate: checked })}
        />
      </div>
    </div>
  );
}
