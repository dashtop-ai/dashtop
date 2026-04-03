"use client";

import { nanoid } from "nanoid";
import { Edit, Eye, Save, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WidgetPicker } from "./widget-picker";
import { type DashboardConfig } from "@/widgets/types";
import { getWidget } from "@/widgets/registry";
import { updateDashboardConfig } from "@/lib/actions/dashboard.actions";
import { toast } from "sonner";
import Link from "next/link";

interface DashboardToolbarProps {
  dashboardId: string;
  dashboardName: string;
  isEditing: boolean;
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

export function DashboardToolbar({
  dashboardId,
  dashboardName,
  isEditing,
  config,
  onConfigChange,
}: DashboardToolbarProps) {
  const handleAddWidget = (widgetType: string) => {
    const entry = getWidget(widgetType);
    if (!entry) return;

    const instanceId = `${widgetType}-${nanoid(6)}`;
    const { defaultSize, minSize, maxSize } = entry.manifest;

    const newLayout = {
      i: instanceId,
      x: 0,
      y: Infinity, // Places at bottom
      w: defaultSize.w,
      h: defaultSize.h,
      minW: minSize.w,
      minH: minSize.h,
      ...(maxSize && { maxW: maxSize.w, maxH: maxSize.h }),
    };

    onConfigChange({
      ...config,
      layouts: {
        lg: [...config.layouts.lg, newLayout],
        md: [...config.layouts.md, { ...newLayout, w: Math.min(newLayout.w, 8) }],
        sm: [...config.layouts.sm, { ...newLayout, w: Math.min(newLayout.w, 4) }],
      },
      widgets: {
        ...config.widgets,
        [instanceId]: {
          type: widgetType,
          config: {},
          addedAt: new Date().toISOString(),
        },
      },
    });
  };

  const handleSave = async () => {
    try {
      await updateDashboardConfig(dashboardId, JSON.stringify(config));
      toast.success("Dashboard saved");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-2 bg-background">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">{dashboardName}</h1>
        {isEditing && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Editing
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <WidgetPicker onAddWidget={handleAddWidget} />
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" render={<Link href={`/dashboard/${dashboardId}`} />}>
                <Eye className="h-4 w-4 mr-1" />
                View
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" render={<Link href={`/dashboard/${dashboardId}/edit`} />}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
            </Button>
            <Button size="sm" variant="ghost" render={<Link href={`/dashboard/${dashboardId}/settings`} />}>
                <Settings className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
