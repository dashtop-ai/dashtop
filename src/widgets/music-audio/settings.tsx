"use client";

import { type WidgetProps } from "../types";
import { type MusicAudioConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MusicAudioSettings({
  config,
  onConfigChange,
}: WidgetProps<MusicAudioConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Model</Label>
        <Select
          value={config.model}
          onValueChange={(val) =>
            onConfigChange({
              model: val as MusicAudioConfig["model"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="musicgen">MusicGen</SelectItem>
            <SelectItem value="audioldm">AudioLDM</SelectItem>
            <SelectItem value="riffusion">Riffusion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Duration</Label>
          <span className="text-xs text-muted-foreground">{config.duration}s</span>
        </div>
        <Slider
          value={[config.duration]}
          onValueChange={(val) =>
            onConfigChange({
              duration: Array.isArray(val) ? val[0] : val,
            })
          }
          min={15}
          max={120}
          step={5}
        />
      </div>

      <div className="space-y-2">
        <Label>Genre</Label>
        <Select
          value={config.genre}
          onValueChange={(val) =>
            onConfigChange({
              genre: val as MusicAudioConfig["genre"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ambient">Ambient</SelectItem>
            <SelectItem value="electronic">Electronic</SelectItem>
            <SelectItem value="classical">Classical</SelectItem>
            <SelectItem value="jazz">Jazz</SelectItem>
            <SelectItem value="rock">Rock</SelectItem>
            <SelectItem value="hip-hop">Hip-Hop</SelectItem>
            <SelectItem value="lo-fi">Lo-fi</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
