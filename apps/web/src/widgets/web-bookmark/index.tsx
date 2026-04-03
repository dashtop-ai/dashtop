"use client";

import { Globe } from "lucide-react";
import { type WidgetProps } from "../types";
import { type WebBookmarkConfig } from "./config";

export default function WebBookmarkWidget({
  config,
}: WidgetProps<WebBookmarkConfig>) {
  const handleClick = () => {
    if (config.url) {
      window.open(config.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 h-full w-full p-4 text-left hover:bg-muted/50 transition-colors rounded-md"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        {config.iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={config.iconUrl}
            alt=""
            className="w-6 h-6 rounded"
          />
        ) : (
          <Globe className="w-5 h-5 text-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">
          {config.title || "New Bookmark"}
        </div>
        {config.description && (
          <div className="text-xs text-muted-foreground truncate">
            {config.description}
          </div>
        )}
        {config.url && (
          <div className="text-xs text-muted-foreground/60 truncate">
            {config.url}
          </div>
        )}
      </div>
    </button>
  );
}
