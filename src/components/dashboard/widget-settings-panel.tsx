"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { type WidgetInstance } from "@/widgets/types";
import { getWidget } from "@/widgets/registry";

interface WidgetSettingsPanelProps {
  instanceId: string;
  widget: WidgetInstance;
  onConfigChange: (patch: Record<string, unknown>) => void;
  onClose: () => void;
}

export function WidgetSettingsPanel({
  instanceId,
  widget,
  onConfigChange,
  onClose,
}: WidgetSettingsPanelProps) {
  const entry = getWidget(widget.type);
  if (!entry?.settingsComponent) return null;

  const SettingsComponent = entry.settingsComponent;
  const mergedConfig = { ...entry.manifest.defaultConfig, ...widget.config };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            {entry.manifest.name} Settings
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <SettingsComponent
            instanceId={instanceId}
            config={mergedConfig}
            isEditing={true}
            onConfigChange={onConfigChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
