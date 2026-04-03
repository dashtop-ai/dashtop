# @dashtop/widget-sdk

Build custom widgets for the Dashtop AI Dashboard Marketplace.

## Quick Start

```bash
# Create a new widget project
npx @dashtop/widget-sdk init my-widget
cd my-widget
npm install

# Develop
npm run dev       # Start dev server with live preview

# Build & package
npm run pack      # Creates dist/my-widget.dashtop
```

## How It Works

Dashtop widgets run inside **sandboxed iframes** for security. Your widget code never has access to the host page, cookies, or other widgets. Communication happens through a `postMessage` bridge.

```
┌──────────────────────────────────┐
│  Dashtop Dashboard (host)        │
│  ┌────────────────────────────┐  │
│  │  <iframe sandbox>          │  │
│  │  ┌──────────────────────┐  │  │
│  │  │  Your Widget         │  │  │
│  │  │  (bundle.js)         │  │  │
│  │  └──────────────────────┘  │  │
│  │        ↕ postMessage       │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

## Writing a Widget

Every widget is a **render function** that receives a DOM element and props:

```typescript
// src/widget.ts
import { defineWidget } from '@dashtop/widget-sdk';

interface MyConfig {
  name: string;
  color: string;
}

export default defineWidget<MyConfig>((root, { config, isEditing, onConfigChange }) => {
  // Render your widget
  root.innerHTML = `
    <div style="color: ${config.color}">
      Hello, ${config.name}!
    </div>
  `;

  // Handle user interaction
  root.querySelector('div')?.addEventListener('click', () => {
    onConfigChange({ name: 'World' });
  });

  // Return cleanup function (optional)
  return () => { root.innerHTML = ''; };
});
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `config` | `TConfig` | Current widget configuration (defaults merged with user overrides) |
| `isEditing` | `boolean` | Whether the dashboard is in edit mode |
| `onConfigChange` | `(patch) => void` | Update the widget's config (partial update) |

### Settings UI

Settings are defined as **JSON Schema** in `widget.config.json`. The host dashboard auto-generates the settings form — your widget code doesn't need to render settings UI.

```json
{
  "settingsSchema": {
    "type": "object",
    "properties": {
      "city": { "type": "string", "title": "City" },
      "units": { "type": "string", "enum": ["metric", "imperial"] }
    }
  }
}
```

## Project Structure

```
my-widget/
├── src/
│   └── widget.ts          # Your widget render function
├── widget.config.json     # Widget metadata & defaults
├── vite.config.ts         # Build config (uses SDK plugin)
├── package.json
└── tsconfig.json
```

## Configuration (`widget.config.json`)

```json
{
  "name": "My Widget",
  "widgetType": "my-widget",
  "version": "1.0.0",
  "description": "What this widget does",
  "category": "utility",
  "tags": ["tag1", "tag2"],
  "author": { "name": "You", "username": "your-username" },
  "permissions": [],
  "defaultConfig": { "key": "value" },
  "defaultSize": { "w": 4, "h": 3 },
  "minSize": { "w": 2, "h": 2 }
}
```

### Categories
`ai` | `analytics` | `media` | `productivity` | `data-viz` | `utility` | `communication`

### Permissions
| Permission | Description |
|-----------|-------------|
| `network:fetch` | Make HTTP requests (proxied through host) |
| `storage:local` | Persist data in widget-scoped storage |
| `clipboard:read` | Read from clipboard |
| `clipboard:write` | Write to clipboard |
| `theme:read` | Access current dashboard theme colors |
| `resize:request` | Request widget resize |

## Network Requests

Widgets can't make direct network requests (sandbox blocks them). Instead, use `proxyFetch`:

```typescript
import { proxyFetch } from '@dashtop/widget-sdk/bridge';

// Requires "network:fetch" permission in widget.config.json
const data = await proxyFetch('https://api.example.com/data', {
  method: 'GET',
  headers: { 'Accept': 'application/json' }
});
```

## Vite Plugin

The SDK includes a Vite plugin that configures the correct build output:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { dashtopWidget } from '@dashtop/widget-sdk/vite';

export default defineConfig({
  plugins: [dashtopWidget({
    entry: 'src/widget.ts',    // default
    outFile: 'bundle.js',      // default
  })],
});
```

## Publishing

1. Build and package: `npm run pack`
2. This creates `dist/username-widgettype-v1.0.0.dashtop`
3. Install locally: Settings → Packages → Install Package
4. Publish to marketplace: Create a listing and upload the `.dashtop` file

## Security Model

- Widget code runs in `<iframe sandbox="allow-scripts">`
- No access to host page DOM, cookies, localStorage, or IndexedDB
- No direct network access — all requests proxied with rate limiting
- Settings UI runs in the trusted host frame (not your code)
- Permissions are reviewed by users before installation
