import { type ComponentType } from "react";
import { type LayoutItem } from "react-grid-layout";

// ── Core Widget Protocol ──────────────────────

export interface WidgetProps<
  TConfig = Record<string, unknown>,
> {
  instanceId: string;
  config: TConfig;
  isEditing: boolean;
  onConfigChange: (patch: Partial<TConfig>) => void;
}

export interface WidgetManifest<
  TConfig = Record<string, unknown>,
> {
  type: string;
  name: string;
  description: string;
  category: WidgetCategory;
  icon: string;
  defaultConfig: TConfig;
  defaultSize: WidgetSize;
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  tags: string[];
  version: string;
}

export interface WidgetSize {
  w: number;
  h: number;
}

export type WidgetCategory =
  | "ai"
  | "analytics"
  | "media"
  | "productivity"
  | "data-viz"
  | "utility"
  | "communication";

// ── Dashboard Config (serialized to JSON) ─────

export interface DashboardConfig {
  version: number;
  layouts: {
    lg: LayoutItem[];
    md: LayoutItem[];
    sm: LayoutItem[];
  };
  widgets: Record<string, WidgetInstance>;
}

export interface WidgetInstance {
  type: string;
  config: Record<string, unknown>;
  addedAt: string;
}

// ── Registry Types ────────────────────────────

export interface WidgetRegistryEntry {
  component: ComponentType<WidgetProps<any>>;
  settingsComponent?: ComponentType<WidgetProps<any>>;
  manifest: WidgetManifest<any>;
}

// ── Blank Config ──────────────────────────────

export const BLANK_DASHBOARD_CONFIG: DashboardConfig = {
  version: 1,
  layouts: { lg: [], md: [], sm: [] },
  widgets: {},
};
