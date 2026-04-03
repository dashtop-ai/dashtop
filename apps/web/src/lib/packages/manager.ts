import JSZip from "jszip";
import {
  type DashtopManifest,
  type ThemePayload,
  type PresetPayload,
  type TemplatePayload,
  type PackageType,
  manifestSchema,
  themePayloadSchema,
  presetPayloadSchema,
  templatePayloadSchema,
} from "./types";

// ── Package Reading ───────────────────────────

export interface ParsedPackage {
  manifest: DashtopManifest;
  themePayload?: ThemePayload;
  presetPayload?: PresetPayload;
  templatePayload?: TemplatePayload;
  widgetBundle?: Uint8Array;
  widgetCSS?: string;
  icon?: Uint8Array;
  thumbnail?: Uint8Array;
}

export async function parsePackage(data: ArrayBuffer): Promise<ParsedPackage> {
  const zip = await JSZip.loadAsync(data);

  // Read and validate manifest
  const manifestFile = zip.file("manifest.json");
  if (!manifestFile) {
    throw new Error("Package missing manifest.json");
  }
  const manifestRaw = JSON.parse(await manifestFile.async("string"));
  const manifest = manifestSchema.parse(manifestRaw) as DashtopManifest;

  const result: ParsedPackage = { manifest };

  // Read type-specific payloads
  switch (manifest.type) {
    case "theme": {
      const file = zip.file("theme.json");
      if (!file) throw new Error("Theme package missing theme.json");
      const raw = JSON.parse(await file.async("string"));
      result.themePayload = themePayloadSchema.parse(raw) as ThemePayload;
      break;
    }
    case "preset": {
      const file = zip.file("preset.json");
      if (!file) throw new Error("Preset package missing preset.json");
      const raw = JSON.parse(await file.async("string"));
      result.presetPayload = presetPayloadSchema.parse(raw) as PresetPayload;
      break;
    }
    case "template": {
      const file = zip.file("template.json");
      if (!file) throw new Error("Template package missing template.json");
      const raw = JSON.parse(await file.async("string"));
      result.templatePayload = templatePayloadSchema.parse(raw) as TemplatePayload;
      break;
    }
    case "widget": {
      if (!manifest.widget) throw new Error("Widget package missing widget field in manifest");
      const bundlePath = manifest.widget.entrypoint;
      const bundleFile = zip.file(bundlePath);
      if (!bundleFile) throw new Error(`Widget bundle not found: ${bundlePath}`);
      result.widgetBundle = await bundleFile.async("uint8array");

      const cssFile = zip.file("widget/bundle.css");
      if (cssFile) {
        result.widgetCSS = await cssFile.async("string");
      }
      break;
    }
  }

  // Optional files
  const iconFile = zip.file("icon.svg") || zip.file("icon.png");
  if (iconFile) {
    result.icon = await iconFile.async("uint8array");
  }
  const thumbnailFile = zip.file("thumbnail.png") || zip.file("thumbnail.jpg");
  if (thumbnailFile) {
    result.thumbnail = await thumbnailFile.async("uint8array");
  }

  return result;
}

// ── Package Building ──────────────────────────

export interface BuildPackageOptions {
  manifest: DashtopManifest;
  themePayload?: ThemePayload;
  presetPayload?: PresetPayload;
  templatePayload?: TemplatePayload;
  widgetBundle?: Uint8Array;
  widgetCSS?: string;
}

export async function buildPackage(options: BuildPackageOptions): Promise<Blob> {
  const zip = new JSZip();

  // Always include manifest
  zip.file("manifest.json", JSON.stringify(options.manifest, null, 2));

  // Type-specific payloads
  if (options.themePayload) {
    zip.file("theme.json", JSON.stringify(options.themePayload, null, 2));
  }
  if (options.presetPayload) {
    zip.file("preset.json", JSON.stringify(options.presetPayload, null, 2));
  }
  if (options.templatePayload) {
    zip.file("template.json", JSON.stringify(options.templatePayload, null, 2));
  }
  if (options.widgetBundle) {
    const entrypoint = options.manifest.widget?.entrypoint || "widget/bundle.js";
    zip.file(entrypoint, options.widgetBundle);
  }
  if (options.widgetCSS) {
    zip.file("widget/bundle.css", options.widgetCSS);
  }

  return zip.generateAsync({ type: "blob" });
}

// ── Helpers ───────────────────────────────────

export function generatePackageId(username: string, name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `@${username}/${slug}`;
}

export function getPackageFilename(manifest: DashtopManifest): string {
  const name = manifest.id.replace("@", "").replace("/", "-");
  return `${name}-v${manifest.version}.dashtop`;
}

export const PACKAGE_SIZE_LIMITS: Record<PackageType, number> = {
  theme: 256 * 1024,    // 256 KB
  preset: 256 * 1024,   // 256 KB
  template: 1024 * 1024, // 1 MB
  widget: 5 * 1024 * 1024, // 5 MB
};
