"use client";

import { ShieldCheck } from "lucide-react";
import { type WidgetProps } from "../types";
import { type ApiKeyManagerConfig } from "./config";

export default function ApiKeyManagerSettings(
  _props: WidgetProps<ApiKeyManagerConfig>
) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
        <ShieldCheck className="size-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Encryption</p>
          <p className="text-xs text-muted-foreground">
            All API keys are encrypted at rest using AES-256-GCM. Keys are never
            transmitted to our servers and remain stored locally in your browser.
          </p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        Manage your API keys directly in the widget. Use the eye icon to
        temporarily reveal a key, or the trash icon to remove it.
      </div>
    </div>
  );
}
