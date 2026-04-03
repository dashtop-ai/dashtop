"use client";

import { type WidgetProps } from "../types";
import { type ConceptExplainerConfig } from "./config";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConceptExplainerSettings({
  config,
  onConfigChange,
}: WidgetProps<ConceptExplainerConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Explanation Level</Label>
        <Select
          value={config.level}
          onValueChange={(value) =>
            value &&
            onConfigChange({
              level: value as ConceptExplainerConfig["level"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Explanation Style</Label>
        <Select
          value={config.style}
          onValueChange={(value) =>
            value &&
            onConfigChange({
              style: value as ConceptExplainerConfig["style"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eli5">ELI5 (Simple)</SelectItem>
            <SelectItem value="textbook">Textbook</SelectItem>
            <SelectItem value="analogy">Analogy</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
