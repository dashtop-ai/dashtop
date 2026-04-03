"use client";

import { useState, useCallback, useEffect } from "react";
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout";
import type { Layout, LayoutItem, ResponsiveLayouts } from "react-grid-layout";
import { type DashboardConfig } from "@/widgets/types";
import { getWidget } from "@/widgets/registry";
import { WidgetWrapper } from "./widget-wrapper";
import { WidgetSettingsPanel } from "./widget-settings-panel";
import { updateDashboardConfig } from "@/lib/actions/dashboard.actions";
import { toast } from "sonner";
import "react-grid-layout/css/styles.css";

const GRID_COLS = { lg: 12, md: 8, sm: 4 };
const ROW_HEIGHT = 80;
const GRID_MARGIN: [number, number] = [12, 12];

interface DashboardGridProps {
  dashboardId: string;
  initialConfig: DashboardConfig;
  isEditing: boolean;
}

export function DashboardGrid({
  dashboardId,
  initialConfig,
  isEditing,
}: DashboardGridProps) {
  const { width: containerWidth, containerRef } = useContainerWidth({ initialWidth: 1200 });
  const [config, setConfig] = useState<DashboardConfig>(initialConfig);
  const [settingsWidgetId, setSettingsWidgetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with server when config changes in edit mode
  const saveConfig = useCallback(
    async (newConfig: DashboardConfig) => {
      setIsSaving(true);
      try {
        await updateDashboardConfig(dashboardId, JSON.stringify(newConfig));
      } catch {
        toast.error("Failed to save dashboard");
      } finally {
        setIsSaving(false);
      }
    },
    [dashboardId]
  );

  // Auto-save debounce
  useEffect(() => {
    if (!isEditing) return;
    const timeout = setTimeout(() => {
      saveConfig(config);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [config, isEditing, saveConfig]);

  const handleLayoutChange = (_layout: Layout, allLayouts: ResponsiveLayouts) => {
    if (!isEditing) return;
    setConfig((prev) => ({
      ...prev,
      layouts: {
        lg: [...(allLayouts.lg || prev.layouts.lg)],
        md: [...(allLayouts.md || prev.layouts.md)],
        sm: [...(allLayouts.sm || prev.layouts.sm)],
      },
    }));
  };

  const handleWidgetConfigChange = (
    instanceId: string,
    patch: Record<string, unknown>
  ) => {
    setConfig((prev) => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [instanceId]: {
          ...prev.widgets[instanceId],
          config: { ...prev.widgets[instanceId].config, ...patch },
        },
      },
    }));
  };

  const handleRemoveWidget = (instanceId: string) => {
    setConfig((prev) => {
      const { [instanceId]: _, ...remainingWidgets } = prev.widgets;
      return {
        ...prev,
        layouts: {
          lg: prev.layouts.lg.filter((l) => l.i !== instanceId),
          md: prev.layouts.md.filter((l) => l.i !== instanceId),
          sm: prev.layouts.sm.filter((l) => l.i !== instanceId),
        },
        widgets: remainingWidgets,
      };
    });
  };

  const layouts: ResponsiveLayouts = {
    lg: config.layouts.lg,
    md: config.layouts.md,
    sm: config.layouts.sm,
  };

  return (
    <div className="relative" ref={containerRef}>
      {isSaving && (
        <div className="absolute top-2 right-2 z-10 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Saving...
        </div>
      )}

      <ResponsiveGridLayout
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 768, sm: 0 }}
        cols={GRID_COLS}
        rowHeight={ROW_HEIGHT}
        margin={GRID_MARGIN}
        dragConfig={{ enabled: isEditing, handle: ".drag-handle" }}
        resizeConfig={{ enabled: isEditing }}
        onLayoutChange={handleLayoutChange}
        width={containerWidth || 1200}
      >
        {Object.entries(config.widgets).map(([instanceId, widget]) => {
          const entry = getWidget(widget.type);
          if (!entry) return <div key={instanceId} />;

          const Component = entry.component;
          const mergedConfig = {
            ...entry.manifest.defaultConfig,
            ...widget.config,
          };

          return (
            <div key={instanceId} className={isEditing ? "drag-handle" : ""}>
              <WidgetWrapper
                title={entry.manifest.name}
                icon={entry.manifest.icon}
                isEditing={isEditing}
                onSettingsClick={() => setSettingsWidgetId(instanceId)}
                onRemove={() => handleRemoveWidget(instanceId)}
              >
                <Component
                  instanceId={instanceId}
                  config={mergedConfig}
                  isEditing={isEditing}
                  onConfigChange={(patch) =>
                    handleWidgetConfigChange(instanceId, patch)
                  }
                />
              </WidgetWrapper>
            </div>
          );
        })}
      </ResponsiveGridLayout>

      {settingsWidgetId && config.widgets[settingsWidgetId] && (
        <WidgetSettingsPanel
          instanceId={settingsWidgetId}
          widget={config.widgets[settingsWidgetId]}
          onConfigChange={(patch) =>
            handleWidgetConfigChange(settingsWidgetId, patch)
          }
          onClose={() => setSettingsWidgetId(null)}
        />
      )}
    </div>
  );
}
