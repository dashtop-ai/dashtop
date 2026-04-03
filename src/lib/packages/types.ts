import { z } from "zod";

// ── Package Types ─────────────────────────────

export type PackageType = "theme" | "preset" | "template" | "widget";

export interface DashtopManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  type: PackageType;
  category: string;
  tags: string[];
  author: {
    name: string;
    username: string;
  };
  dashtopVersion: string;

  // Preset-specific
  targetWidgetType?: string;

  // Template-specific
  requiredWidgets?: string[];

  // Widget-specific
  widget?: {
    widgetType: string;
    entrypoint: string;
    sandbox: true;
    permissions: string[];
    defaultConfig: Record<string, unknown>;
    defaultSize: { w: number; h: number };
    minSize: { w: number; h: number };
    settingsSchema?: Record<string, unknown>;
  };
}

// ── Theme Payload ─────────────────────────────

export interface ThemePayload {
  colorScheme: "light" | "dark";
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    muted: string;
    border: string;
  };
}

// ── Preset Payload ────────────────────────────

export interface PresetPayload {
  targetWidgetType: string;
  config: Record<string, unknown>;
}

// ── Template Payload ──────────────────────────

export interface TemplatePayload {
  version: number;
  layouts: {
    lg: Record<string, unknown>[];
    md: Record<string, unknown>[];
    sm: Record<string, unknown>[];
  };
  widgets: Record<
    string,
    {
      type: string;
      config: Record<string, unknown>;
      addedAt: string;
    }
  >;
}

// ── Zod Validation Schemas ────────────────────

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export const manifestSchema = z.object({
  id: z.string().regex(/^@[a-z0-9-]+\/[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().max(200),
  type: z.enum(["theme", "preset", "template", "widget"]),
  category: z.string(),
  tags: z.array(z.string()).max(10),
  author: z.object({
    name: z.string(),
    username: z.string(),
  }),
  dashtopVersion: z.string(),

  targetWidgetType: z.string().optional(),
  requiredWidgets: z.array(z.string()).optional(),

  widget: z
    .object({
      widgetType: z.string(),
      entrypoint: z.string(),
      sandbox: z.literal(true),
      permissions: z.array(z.string()),
      defaultConfig: z.record(z.string(), z.unknown()),
      defaultSize: z.object({ w: z.number(), h: z.number() }),
      minSize: z.object({ w: z.number(), h: z.number() }),
      settingsSchema: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

export const themePayloadSchema = z.object({
  colorScheme: z.enum(["light", "dark"]),
  colors: z.object({
    background: z.string().regex(hexColorPattern),
    surface: z.string().regex(hexColorPattern),
    primary: z.string().regex(hexColorPattern),
    accent: z.string().regex(hexColorPattern),
    text: z.string().regex(hexColorPattern),
    muted: z.string().regex(hexColorPattern),
    border: z.string().regex(hexColorPattern),
  }),
});

export const presetPayloadSchema = z.object({
  targetWidgetType: z.string(),
  config: z.record(z.string(), z.unknown()),
});

export const templatePayloadSchema = z.object({
  version: z.number(),
  layouts: z.object({
    lg: z.array(z.any()),
    md: z.array(z.any()),
    sm: z.array(z.any()),
  }),
  widgets: z.record(
    z.string(),
    z.object({
      type: z.string(),
      config: z.record(z.string(), z.unknown()),
      addedAt: z.string(),
    })
  ),
});

// ── Widget Permissions ────────────────────────

export const WIDGET_PERMISSIONS = [
  "network:fetch",
  "storage:local",
  "clipboard:read",
  "clipboard:write",
  "theme:read",
  "resize:request",
] as const;

export type WidgetPermission = (typeof WIDGET_PERMISSIONS)[number];
