/**
 * CLI for Dashtop widget development.
 *
 * Commands:
 *   dashtop-widget init    - Initialize a new widget project
 *   dashtop-widget build   - Build the widget bundle
 *   dashtop-widget pack    - Package as .dashtop file
 *   dashtop-widget dev     - Start dev server with sandbox preview
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

// ── Types ─────────────────────────────────────

interface WidgetConfig {
  name: string;
  widgetType: string;
  version: string;
  description: string;
  category: string;
  tags: string[];
  author: { name: string; username: string };
  permissions: string[];
  defaultConfig: Record<string, unknown>;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  settingsSchema?: Record<string, unknown>;
}

// ── Commands ──────────────────────────────────

function init(projectName?: string) {
  const dir = projectName ? resolve(projectName) : process.cwd();
  const name = projectName || "my-widget";

  if (projectName && !existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const srcDir = join(dir, "src");
  if (!existsSync(srcDir)) mkdirSync(srcDir, { recursive: true });

  // widget.config.json
  const config: WidgetConfig = {
    name: `${name} Widget`,
    widgetType: name.toLowerCase().replace(/\s+/g, "-"),
    version: "1.0.0",
    description: `A custom Dashtop widget`,
    category: "utility",
    tags: [],
    author: { name: "Your Name", username: "your-username" },
    permissions: [],
    defaultConfig: {},
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 2, h: 2 },
  };

  writeFileSync(
    join(dir, "widget.config.json"),
    JSON.stringify(config, null, 2)
  );

  // src/widget.ts — uses DashtopApp base class
  writeFileSync(
    join(srcDir, "widget.ts"),
    `import { DashtopApp } from '@dashtop/widget-sdk';

/**
 * ${config.name}
 *
 * Extend DashtopApp to get the standard layout for free:
 * - Header with icon, name, status, and pill actions
 * - Scrollable content area (you fill this)
 * - Chat input (you handle messages)
 *
 * Just implement renderContent() and onChat().
 */

interface MyConfig {
  greeting: string;
}

class ${name.replace(/[^a-zA-Z]/g, '')}App extends DashtopApp<MyConfig> {
  name = "${config.name}";
  icon = "🚀";
  color = "#7c3aed";
  placeholder = "Ask me anything...";

  renderContent(container: HTMLElement) {
    const greeting = this.config.greeting || "Hello!";
    container.innerHTML = \`
      <div style="padding: 16px;">
        <h2 style="font-size: 16px; margin: 0 0 8px;">\${greeting}</h2>
        <p style="font-size: 13px; color: #666; margin: 0;">
          This is your app. Edit renderContent() to change what appears here.
        </p>
        <p style="font-size: 12px; color: #999; margin-top: 12px;">
          Type in the chat below to test onChat().
        </p>
      </div>
    \`;
  }

  async onChat(message: string): Promise<string> {
    // In production: call an AI API via proxyFetch()
    return \`You said: "\${message}" — connect this to an AI API!\`;
  }
}

export default new ${name.replace(/[^a-zA-Z]/g, '')}App().asWidget();
`
  );

  // vite.config.ts
  writeFileSync(
    join(dir, "vite.config.ts"),
    `import { defineConfig } from 'vite';
import { dashtopWidget } from '@dashtop/widget-sdk/vite';

export default defineConfig({
  plugins: [dashtopWidget()],
});
`
  );

  // package.json
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      {
        name: `@dashtop-widgets/${config.widgetType}`,
        version: config.version,
        type: "module",
        private: true,
        scripts: {
          dev: "dashtop-widget dev",
          build: "vite build",
          pack: "vite build && dashtop-widget pack",
        },
        devDependencies: {
          "@dashtop/widget-sdk": "^0.1.0",
          vite: "^6.0.0",
          typescript: "^5.0.0",
        },
      },
      null,
      2
    )
  );

  // tsconfig.json
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          strict: true,
          lib: ["ES2022", "DOM"],
          outDir: "dist",
          rootDir: "src",
        },
        include: ["src"],
      },
      null,
      2
    )
  );

  console.log(`\n  Widget project created${projectName ? ` in ${projectName}/` : ""}!\n`);
  console.log("  Next steps:");
  console.log(`    ${projectName ? `cd ${projectName} && ` : ""}npm install`);
  console.log("    npm run dev     # Start dev server");
  console.log("    npm run pack    # Build & package as .dashtop\n");
}

async function pack() {
  const configPath = resolve("widget.config.json");
  if (!existsSync(configPath)) {
    console.error("Error: widget.config.json not found. Run `dashtop-widget init` first.");
    process.exit(1);
  }

  const bundlePath = resolve("dist/bundle.js");
  if (!existsSync(bundlePath)) {
    console.error("Error: dist/bundle.js not found. Run `vite build` first.");
    process.exit(1);
  }

  const config: WidgetConfig = JSON.parse(readFileSync(configPath, "utf-8"));
  const bundle = readFileSync(bundlePath);

  // Dynamic import JSZip
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  // Generate manifest.json
  const manifest = {
    id: `@${config.author.username}/${config.widgetType}`,
    name: config.name,
    version: config.version,
    description: config.description,
    type: "widget" as const,
    category: config.category,
    tags: config.tags,
    author: config.author,
    dashtopVersion: ">=0.1.0",
    widget: {
      widgetType: config.widgetType,
      entrypoint: "widget/bundle.js",
      sandbox: true as const,
      permissions: config.permissions,
      defaultConfig: config.defaultConfig,
      defaultSize: config.defaultSize,
      minSize: config.minSize,
      ...(config.maxSize && { maxSize: config.maxSize }),
      ...(config.settingsSchema && { settingsSchema: config.settingsSchema }),
    },
  };

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  zip.file("widget/bundle.js", bundle);

  // Include CSS if it exists
  const cssPath = resolve("dist/bundle.css");
  if (existsSync(cssPath)) {
    zip.file("widget/bundle.css", readFileSync(cssPath));
  }

  // Include sourcemap if it exists
  const mapPath = resolve("dist/bundle.js.map");
  if (existsSync(mapPath)) {
    zip.file("widget/bundle.js.map", readFileSync(mapPath));
  }

  const outputName = `${config.author.username}-${config.widgetType}-v${config.version}.dashtop`;
  const content = await zip.generateAsync({ type: "nodebuffer" });

  const outDir = resolve("dist");
  writeFileSync(join(outDir, outputName), content);

  const sizeKB = Math.round(content.length / 1024);
  console.log(`\n  Package created: dist/${outputName} (${sizeKB} KB)\n`);
  console.log("  Install in Dashtop:");
  console.log("    Settings → Packages → Install Package → Select the .dashtop file\n");
}

function dev() {
  const configPath = resolve("widget.config.json");
  if (!existsSync(configPath)) {
    console.error("Error: widget.config.json not found. Run `dashtop-widget init` first.");
    process.exit(1);
  }

  const config: WidgetConfig = JSON.parse(readFileSync(configPath, "utf-8"));

  // Create a dev HTML page that simulates the sandbox
  const devHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashtop Widget Dev — ${config.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #f5f5f5; }
    .toolbar { background: #18181b; color: white; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }
    .toolbar h1 { font-size: 14px; font-weight: 600; }
    .toolbar .badge { font-size: 11px; background: #7c3aed; padding: 2px 8px; border-radius: 4px; }
    .controls { padding: 12px 20px; background: white; border-bottom: 1px solid #e5e5e5; display: flex; gap: 8px; align-items: center; }
    .controls button { padding: 6px 14px; border-radius: 6px; border: 1px solid #d4d4d4; background: white; cursor: pointer; font-size: 13px; }
    .controls button:hover { background: #f5f5f5; }
    .controls button.active { background: #7c3aed; color: white; border-color: #7c3aed; }
    .preview { padding: 20px; display: flex; justify-content: center; }
    .widget-frame { width: ${config.defaultSize.w * 100}px; height: ${config.defaultSize.h * 100}px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; resize: both; border: 1px solid #e5e5e5; }
    .config-panel { position: fixed; right: 0; top: 0; bottom: 0; width: 300px; background: white; border-left: 1px solid #e5e5e5; padding: 20px; overflow: auto; }
    .config-panel h2 { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
    .config-panel pre { font-size: 12px; background: #f5f5f5; padding: 12px; border-radius: 6px; overflow: auto; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>Dashtop Widget Dev Server</h1>
    <span class="badge">${config.name} v${config.version}</span>
  </div>
  <div class="controls">
    <button id="btn-view" class="active">View Mode</button>
    <button id="btn-edit">Edit Mode</button>
    <button id="btn-reset">Reset Config</button>
    <span style="font-size: 12px; color: #888; margin-left: auto;">Resize the widget frame to test responsive behavior</span>
  </div>
  <div style="display: flex;">
    <div class="preview" style="flex: 1; margin-right: 300px;">
      <div class="widget-frame" id="widget-frame"></div>
    </div>
    <div class="config-panel">
      <h2>Live Config</h2>
      <pre id="config-display">{}</pre>
    </div>
  </div>

  <script type="module">
    import widget from '/src/widget.ts';

    let config = ${JSON.stringify(config.defaultConfig)};
    let isEditing = false;
    const root = document.getElementById('widget-frame');
    const configDisplay = document.getElementById('config-display');

    function render() {
      root.innerHTML = '';
      widget(root, {
        config,
        isEditing,
        onConfigChange: (patch) => {
          config = { ...config, ...patch };
          render();
        }
      });
      configDisplay.textContent = JSON.stringify(config, null, 2);
    }

    document.getElementById('btn-view').onclick = () => {
      isEditing = false;
      document.getElementById('btn-view').classList.add('active');
      document.getElementById('btn-edit').classList.remove('active');
      render();
    };
    document.getElementById('btn-edit').onclick = () => {
      isEditing = true;
      document.getElementById('btn-edit').classList.add('active');
      document.getElementById('btn-view').classList.remove('active');
      render();
    };
    document.getElementById('btn-reset').onclick = () => {
      config = ${JSON.stringify(config.defaultConfig)};
      render();
    };

    render();
  </script>
</body>
</html>`;

  // Write dev HTML
  const devDir = resolve(".dashtop-dev");
  if (!existsSync(devDir)) mkdirSync(devDir, { recursive: true });
  writeFileSync(join(devDir, "index.html"), devHtml);

  console.log(`\n  Dashtop Widget Dev Server`);
  console.log(`  Widget: ${config.name} v${config.version}`);
  console.log(`\n  Run this command to start Vite dev server:\n`);
  console.log(`    npx vite --open .dashtop-dev/index.html\n`);
  console.log(`  Or use: npx vite dev\n`);
}

// ── CLI Entry ─────────────────────────────────

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case "init":
    init(arg);
    break;
  case "pack":
    pack();
    break;
  case "dev":
    dev();
    break;
  default:
    console.log(`
  @dashtop/widget-sdk CLI

  Commands:
    dashtop-widget init [name]   Create a new widget project
    dashtop-widget dev           Generate dev server files
    dashtop-widget pack          Build & package as .dashtop

  Workflow:
    1. dashtop-widget init my-widget
    2. cd my-widget && npm install
    3. npm run dev                  # Edit src/widget.ts
    4. npm run pack                 # Creates dist/*.dashtop
    5. Install in Dashtop → Settings → Packages
`);
}

export { init, pack, dev };
