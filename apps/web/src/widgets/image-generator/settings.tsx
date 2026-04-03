"use client";

import { type WidgetProps } from "../types";
import { type ImageGeneratorConfig } from "./config";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ImageGeneratorSettings({
  config,
  onConfigChange,
}: WidgetProps<ImageGeneratorConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Model</Label>
        <Select
          value={config.model}
          onValueChange={(val) =>
            onConfigChange({
              model: val as ImageGeneratorConfig["model"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
            <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
            <SelectItem value="midjourney">Midjourney</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Image Size</Label>
        <Select
          value={config.size}
          onValueChange={(val) =>
            onConfigChange({
              size: val as ImageGeneratorConfig["size"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="256x256">256 x 256</SelectItem>
            <SelectItem value="512x512">512 x 512</SelectItem>
            <SelectItem value="1024x1024">1024 x 1024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Style</Label>
        <Select
          value={config.style}
          onValueChange={(val) =>
            onConfigChange({
              style: val as ImageGeneratorConfig["style"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vivid">Vivid</SelectItem>
            <SelectItem value="natural">Natural</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Quality</Label>
        <Select
          value={config.quality}
          onValueChange={(val) =>
            onConfigChange({
              quality: val as ImageGeneratorConfig["quality"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="hd">HD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
