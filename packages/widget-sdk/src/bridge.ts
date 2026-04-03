/**
 * Widget Bridge — runs INSIDE the sandboxed iframe.
 *
 * Handles communication between the widget and the host dashboard
 * via postMessage. This is automatically set up by the iframe host page,
 * but can also be used manually for advanced scenarios.
 */

import type { WidgetRenderFn, WidgetRenderProps } from "./index";

interface BridgeMessage {
  type: string;
  payload?: unknown;
}

/**
 * Initialize the widget bridge.
 * This connects your widget render function to the host dashboard.
 *
 * @param renderFn - Your widget's render function (the default export)
 * @param rootElement - The DOM element to render into (defaults to #root)
 *
 * @example
 * ```ts
 * import { initBridge, defineWidget } from '@dashtop/widget-sdk';
 *
 * const widget = defineWidget((root, { config }) => {
 *   root.innerHTML = `<h1>${config.title}</h1>`;
 * });
 *
 * initBridge(widget);
 * ```
 */
export function initBridge(
  renderFn: WidgetRenderFn,
  rootElement?: HTMLElement
): void {
  const root: HTMLElement = rootElement || document.getElementById("root")!;
  if (!root) {
    console.error("[dashtop-bridge] No root element found");
    return;
  }

  let cleanup: (() => void) | void;
  let currentConfig: Record<string, unknown> = {};
  let isEditing = false;

  const props: WidgetRenderProps = {
    get config() {
      return currentConfig;
    },
    get isEditing() {
      return isEditing;
    },
    onConfigChange: (patch) => {
      // Send config change to parent frame
      parent.postMessage(
        { type: "config-change", payload: patch } satisfies BridgeMessage,
        "*"
      );
    },
  };

  function render() {
    // Clean up previous render
    if (cleanup) cleanup();
    root.innerHTML = "";

    // Render widget
    try {
      cleanup = renderFn(root, props);
    } catch (err) {
      root.innerHTML = `<div style="color: #ef4444; padding: 8px; font-size: 14px;">
        Widget render error: ${err instanceof Error ? err.message : "Unknown error"}
      </div>`;
      parent.postMessage(
        {
          type: "widget-error",
          payload: err instanceof Error ? err.message : "Unknown error",
        } satisfies BridgeMessage,
        "*"
      );
    }
  }

  // Listen for messages from parent frame
  window.addEventListener("message", (event: MessageEvent<BridgeMessage>) => {
    const { type, payload } = event.data || {};

    switch (type) {
      case "init": {
        const data = payload as { config: Record<string, unknown>; isEditing: boolean };
        currentConfig = data.config || {};
        isEditing = data.isEditing || false;
        render();
        break;
      }

      case "config-update": {
        const patch = payload as Record<string, unknown>;
        currentConfig = { ...currentConfig, ...patch };
        render();
        break;
      }

      case "theme-update": {
        // Future: receive theme changes
        break;
      }
    }
  });

  // Signal ready to parent
  parent.postMessage({ type: "widget-ready" } satisfies BridgeMessage, "*");
}

/**
 * Request a network fetch through the parent frame proxy.
 * Only works if the widget has the "network:fetch" permission.
 *
 * @param url - The URL to fetch
 * @param options - Fetch options (method, headers, body)
 * @returns The response as JSON
 */
export async function proxyFetch(
  url: string,
  options?: { method?: string; headers?: Record<string, string>; body?: string }
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const requestId = Math.random().toString(36).slice(2);

    const handler = (event: MessageEvent<BridgeMessage>) => {
      if (
        event.data?.type === "fetch-response" &&
        (event.data.payload as { requestId: string })?.requestId === requestId
      ) {
        window.removeEventListener("message", handler);
        const data = event.data.payload as {
          requestId: string;
          ok: boolean;
          data?: unknown;
          error?: string;
        };
        if (data.ok) {
          resolve(data.data);
        } else {
          reject(new Error(data.error || "Fetch failed"));
        }
      }
    };

    window.addEventListener("message", handler);

    // Timeout after 30 seconds
    setTimeout(() => {
      window.removeEventListener("message", handler);
      reject(new Error("Fetch timeout"));
    }, 30000);

    parent.postMessage(
      {
        type: "fetch-request",
        payload: { requestId, url, ...options },
      } satisfies BridgeMessage,
      "*"
    );
  });
}
