"use client";

import { type WidgetProps } from "../types";
import { type QuizMeConfig } from "./config";
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

export default function QuizMeSettings({
  config,
  onConfigChange,
}: WidgetProps<QuizMeConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Topic</Label>
        <Input
          value={config.topic}
          onChange={(e) => onConfigChange({ topic: e.target.value })}
          placeholder="e.g. Science, History, Math..."
        />
      </div>

      <div className="space-y-2">
        <Label>Difficulty</Label>
        <Select
          value={config.difficulty}
          onValueChange={(value) =>
            value &&
            onConfigChange({
              difficulty: value as QuizMeConfig["difficulty"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Number of Questions</Label>
          <span className="text-sm text-muted-foreground">
            {config.questionCount}
          </span>
        </div>
        <Slider
          value={[config.questionCount]}
          onValueChange={(value) =>
            onConfigChange({
              questionCount: Array.isArray(value) ? value[0] : value,
            })
          }
          min={3}
          max={10}
          step={1}
        />
      </div>
    </div>
  );
}
