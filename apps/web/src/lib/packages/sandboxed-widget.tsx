"use client";

import { useEffect, useRef, useCallback } from "react";
import { type WidgetProps } from "@/widgets/types";

interface SandboxedWidgetProps extends WidgetProps {
  bundleUrl: string;
  widgetType: string;
}

/**
 * Renders a third-party widget in a sandboxed iframe.
 * Communicates with the widget via postMessage bridge.
 */
export function SandboxedWidget({
  instanceId,
  config,
  isEditing,
  onConfigChange,
  bundleUrl,
}: SandboxedWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);

  // Send config to iframe when it changes
  const sendConfig = useCallback(() => {
    if (!iframeRef.current?.contentWindow || !readyRef.current) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type: "config-update",
        payload: config,
      },
      "*"
    );
  }, [config]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our iframe
      if (event.source !== iframeRef.current?.contentWindow) return;

      const { type, payload } = event.data || {};

      switch (type) {
        case "widget-ready":
          readyRef.current = true;
          // Send initial config
          iframeRef.current?.contentWindow?.postMessage(
            {
              type: "init",
              payload: { config, isEditing },
            },
            "*"
          );
          break;

        case "config-change":
          if (payload && typeof payload === "object") {
            onConfigChange(payload);
          }
          break;

        case "widget-error":
          console.error(`Widget ${instanceId} error:`, payload);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [instanceId, config, isEditing, onConfigChange]);

  // Re-send config when it changes
  useEffect(() => {
    sendConfig();
  }, [sendConfig]);

  const hostUrl = `/api/packages/widget-host?bundle=${encodeURIComponent(bundleUrl)}`;

  return (
    <iframe
      ref={iframeRef}
      src={hostUrl}
      sandbox="allow-scripts"
      className="w-full h-full border-0"
      title={`Widget: ${instanceId}`}
    />
  );
}
