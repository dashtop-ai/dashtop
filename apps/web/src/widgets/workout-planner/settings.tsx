"use client";

import { type WidgetProps } from "../types";
import { type WorkoutPlannerConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function WorkoutPlannerSettings({
  config,
  onConfigChange,
}: WidgetProps<WorkoutPlannerConfig>) {
  return (
    <div className="space-y-5">
      {/* Fitness Level */}
      <div className="space-y-2">
        <Label>Fitness Level</Label>
        <Select
          value={config.fitnessLevel}
          onValueChange={(value) =>
            value && onConfigChange({ fitnessLevel: value as WorkoutPlannerConfig["fitnessLevel"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Goal */}
      <div className="space-y-2">
        <Label>Goal</Label>
        <Select
          value={config.goal}
          onValueChange={(value) =>
            value && onConfigChange({ goal: value as WorkoutPlannerConfig["goal"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="flexibility">Flexibility</SelectItem>
            <SelectItem value="weight-loss">Weight Loss</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Duration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Duration</Label>
          <span className="text-xs text-muted-foreground">
            {config.duration} min
          </span>
        </div>
        <Slider
          value={[config.duration]}
          onValueChange={(v) =>
            onConfigChange({ duration: Array.isArray(v) ? v[0] : v })
          }
          min={15}
          max={90}
          step={5}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>15 min</span>
          <span>90 min</span>
        </div>
      </div>
    </div>
  );
}
