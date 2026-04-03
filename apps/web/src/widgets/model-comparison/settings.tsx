"use client";

import { type WidgetProps } from "../types";
import { type ModelComparisonConfig } from "./config";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const AVAILABLE_MODELS = [
  { id: "gpt-4", label: "GPT-4" },
  { id: "claude-3", label: "Claude 3" },
  { id: "gemini-pro", label: "Gemini Pro" },
  { id: "llama-3", label: "Llama 3" },
  { id: "mistral-large", label: "Mistral Large" },
];

export default function ModelComparisonSettings({
  config,
  onConfigChange,
}: WidgetProps<ModelComparisonConfig>) {
  const toggleModel = (modelId: string, enabled: boolean) => {
    const models = enabled
      ? [...config.models, modelId]
      : config.models.filter((m) => m !== modelId);
    onConfigChange({ models });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Models to Compare</Label>
        {AVAILABLE_MODELS.map((model) => (
          <div key={model.id} className="flex items-center justify-between">
            <Label htmlFor={`model-${model.id}`} className="font-normal">
              {model.label}
            </Label>
            <Switch
              id={`model-${model.id}`}
              checked={config.models.includes(model.id)}
              onCheckedChange={(checked) => toggleModel(model.id, checked)}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Select 2-3 models for the best side-by-side comparison experience.
      </p>
    </div>
  );
}
