"use client";

import { type WidgetProps } from "../types";
import { type DocumentAnalyzerConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function DocumentAnalyzerSettings({
  config,
  onConfigChange,
}: WidgetProps<DocumentAnalyzerConfig>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="extractTables">Extract tables</Label>
        <Switch
          id="extractTables"
          checked={config.extractTables}
          onCheckedChange={(checked) =>
            onConfigChange({ extractTables: checked })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="summarize">Auto-summarize</Label>
        <Switch
          id="summarize"
          checked={config.summarize}
          onCheckedChange={(checked) => onConfigChange({ summarize: checked })}
        />
      </div>
    </div>
  );
}
