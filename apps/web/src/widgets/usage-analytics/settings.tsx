"use client";

import { type WidgetProps } from "../types";
import { type UsageAnalyticsConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsageAnalyticsSettings({
  config,
  onConfigChange,
}: WidgetProps<UsageAnalyticsConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Time Range</Label>
        <Select
          value={config.timeRange}
          onValueChange={(val) => val && onConfigChange({ timeRange: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="showCost">Show cost</Label>
        <Switch
          id="showCost"
          checked={config.showCost}
          onCheckedChange={(checked) => onConfigChange({ showCost: checked })}
        />
      </div>
    </div>
  );
}
