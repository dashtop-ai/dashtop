"use client";

import { useState } from "react";
import { type DashboardConfig } from "@/widgets/types";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";

// Ensure widgets are registered
import "@/widgets/init";

interface DashboardViewProps {
  dashboardId: string;
  dashboardName: string;
  initialConfig: DashboardConfig;
  isEditing: boolean;
}

export function DashboardView({
  dashboardId,
  dashboardName,
  initialConfig,
  isEditing,
}: DashboardViewProps) {
  const [config, setConfig] = useState(initialConfig);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <DashboardToolbar
        dashboardId={dashboardId}
        dashboardName={dashboardName}
        isEditing={isEditing}
        config={config}
        onConfigChange={setConfig}
      />
      <div className="flex-1 overflow-auto p-4 bg-muted/30">
        {Object.keys(config.widgets).length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-1">
                {isEditing
                  ? "Click \"Add Widget\" to get started"
                  : "This dashboard is empty"}
              </p>
              <p className="text-sm">
                {!isEditing && "Switch to edit mode to add widgets."}
              </p>
            </div>
          </div>
        ) : (
          <DashboardGrid
            dashboardId={dashboardId}
            initialConfig={config}
            isEditing={isEditing}
          />
        )}
      </div>
    </div>
  );
}
