import { NextRequest, NextResponse } from "next/server";

/**
 * Serves the iframe host page for sandboxed widgets.
 * The host page loads the widget bundle and sets up the postMessage bridge.
 */
export async function GET(request: NextRequest) {
  const bundleUrl = request.nextUrl.searchParams.get("bundle");
  if (!bundleUrl) {
    return new NextResponse("Missing bundle parameter", { status: 400 });
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { width: 100%; height: 100%; overflow: auto; }
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    // Bridge: parent <-> widget communication
    let widgetRender = null;
    let currentConfig = {};

    // Listen for messages from parent
    window.addEventListener('message', (event) => {
      const { type, payload } = event.data || {};

      switch (type) {
        case 'init':
          currentConfig = payload.config || {};
          if (widgetRender) widgetRender(currentConfig, payload.isEditing);
          break;

        case 'config-update':
          currentConfig = { ...currentConfig, ...payload };
          if (widgetRender) widgetRender(currentConfig, true);
          break;
      }
    });

    // Load widget bundle
    try {
      const module = await import('${bundleUrl}');
      const Widget = module.default;

      if (typeof Widget === 'function') {
        // Simple render function pattern
        widgetRender = (config, isEditing) => {
          const root = document.getElementById('root');
          root.innerHTML = '';
          Widget(root, {
            config,
            isEditing,
            onConfigChange: (patch) => {
              parent.postMessage({ type: 'config-change', payload: patch }, '*');
            }
          });
        };

        // Signal ready
        parent.postMessage({ type: 'widget-ready' }, '*');
      }
    } catch (err) {
      document.getElementById('root').innerHTML =
        '<div style="padding:16px;color:#ef4444;">Widget failed to load: ' +
        err.message + '</div>';
      parent.postMessage({ type: 'widget-error', payload: err.message }, '*');
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Security-Policy":
        "default-src 'none'; script-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'none'",
    },
  });
}
