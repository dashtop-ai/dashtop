"use client";

import { type WidgetProps } from "../types";
import { type StylePresetsConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function StylePresetsSettings({
  config,
  onConfigChange,
}: WidgetProps<StylePresetsConfig>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="show-tags">Show Tags</Label>
        <Switch
          id="show-tags"
          checked={config.showTags}
          onCheckedChange={(checked) => onConfigChange({ showTags: checked })}
        />
      </div>
    </div>
  );
}
