"use client";

import { type WidgetProps } from "../types";
import { type SudokuConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SudokuSettings({
  config,
  onConfigChange,
}: WidgetProps<SudokuConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Difficulty</Label>
        <Select
          value={config.difficulty}
          onValueChange={(value) =>
            value && onConfigChange({ difficulty: value as SudokuConfig["difficulty"] })
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
      <div className="flex items-center justify-between">
        <Label htmlFor="showTimer">Show timer</Label>
        <Switch
          id="showTimer"
          checked={config.showTimer}
          onCheckedChange={(checked) => onConfigChange({ showTimer: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="highlightErrors">Highlight errors</Label>
        <Switch
          id="highlightErrors"
          checked={config.highlightErrors}
          onCheckedChange={(checked) =>
            onConfigChange({ highlightErrors: checked })
          }
        />
      </div>
    </div>
  );
}
