import { type WidgetRegistryEntry, type WidgetManifest } from "@/widgets/types";
import { SandboxedWidget } from "./sandboxed-widget";
import type { DashtopManifest } from "./types";

/**
 * Registry for dynamically installed widgets (from .dashtop packages).
 * Loaded from the InstalledPackage table per-user.
 */
const installedWidgets = new Map<string, WidgetRegistryEntry>();

export function registerInstalledWidget(
  manifest: DashtopManifest,
  bundleUrl: string
): void {
  if (!manifest.widget) return;

  const widgetManifest: WidgetManifest<any> = {
    type: manifest.widget.widgetType,
    name: manifest.name,
    description: manifest.description,
    category: (manifest.category as any) || "utility",
    icon: "Blocks", // Default icon for installed widgets
    defaultConfig: manifest.widget.defaultConfig,
    defaultSize: manifest.widget.defaultSize,
    minSize: manifest.widget.minSize,
    tags: manifest.tags,
    version: manifest.version,
  };

  // Create a component wrapper that injects the bundle URL
  const WrappedComponent = (props: any) =>
    SandboxedWidget({
      ...props,
      bundleUrl,
      widgetType: manifest.widget!.widgetType,
    });

  installedWidgets.set(manifest.widget.widgetType, {
    component: WrappedComponent,
    manifest: widgetManifest,
  });
}

export function getInstalledWidget(
  type: string
): WidgetRegistryEntry | undefined {
  return installedWidgets.get(type);
}

export function getAllInstalledWidgets(): WidgetRegistryEntry[] {
  return Array.from(installedWidgets.values());
}

export function clearInstalledWidgets(): void {
  installedWidgets.clear();
}
