/**
 * Vite plugin for building Dashtop widgets.
 *
 * Configures Vite to produce a single-file ESM bundle suitable
 * for loading inside the Dashtop widget sandbox iframe.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { dashtopWidget } from '@dashtop/widget-sdk/vite';
 *
 * export default defineConfig({
 *   plugins: [dashtopWidget()],
 * });
 * ```
 */

interface DashtopWidgetOptions {
  /** Entry point file (default: "src/widget.ts") */
  entry?: string;
  /** Output filename (default: "bundle.js") */
  outFile?: string;
}

export function dashtopWidget(options: DashtopWidgetOptions = {}) {
  const entry = options.entry || "src/widget.ts";
  const outFile = options.outFile || "bundle.js";

  return {
    name: "dashtop-widget",

    config() {
      return {
        build: {
          lib: {
            entry,
            formats: ["es"] as const,
            fileName: () => outFile,
          },
          outDir: "dist",
          // Single file, no code splitting
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
            },
          },
          // No minification for debugging (creators can enable manually)
          minify: false,
          // Generate sourcemaps for debugging
          sourcemap: true,
        },
      };
    },
  };
}
