import { type WidgetRegistryEntry } from "./types";
import {
  getInstalledWidget,
  getAllInstalledWidgets,
} from "@/lib/packages/installed-registry";

const registry = new Map<string, WidgetRegistryEntry>();

export function registerWidget(entry: WidgetRegistryEntry): void {
  registry.set(entry.manifest.type, entry);
}

/**
 * Two-phase lookup: built-in registry first, then installed packages.
 */
export function getWidget(type: string): WidgetRegistryEntry | undefined {
  return registry.get(type) || getInstalledWidget(type);
}

/**
 * Returns all widgets: built-in + installed.
 */
export function getAllWidgets(): WidgetRegistryEntry[] {
  const builtIn = Array.from(registry.values());
  const installed = getAllInstalledWidgets();
  return [...builtIn, ...installed];
}

export function getWidgetsByCategory(category: string): WidgetRegistryEntry[] {
  return getAllWidgets().filter((w) => w.manifest.category === category);
}
