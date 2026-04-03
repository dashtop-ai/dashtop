"use client";

import { type WidgetProps } from "../types";
import { type ExerciseLogConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function ExerciseLogSettings({
  config,
  onConfigChange,
}: WidgetProps<ExerciseLogConfig>) {
  return (
    <div className="space-y-5">
      {/* Show Streak */}
      <div className="flex items-center justify-between">
        <Label htmlFor="show-streak">Show streak counter</Label>
        <Switch
          id="show-streak"
          checked={config.showStreak}
          onCheckedChange={(checked) => onConfigChange({ showStreak: checked })}
        />
      </div>

      <Separator />

      {/* Unit selector */}
      <div className="space-y-2">
        <Label>Unit System</Label>
        <Select
          value={config.unit}
          onValueChange={(value) =>
            value && onConfigChange({ unit: value as ExerciseLogConfig["unit"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (kg, km)</SelectItem>
            <SelectItem value="imperial">Imperial (lb, mi)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
