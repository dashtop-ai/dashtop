"use client";

import { type WidgetProps } from "../types";
import { type NotesConfig } from "./config";
import { Textarea } from "@/components/ui/textarea";

export default function NotesWidget({
  config,
  onConfigChange,
}: WidgetProps<NotesConfig>) {
  const fontSizeClass =
    config.fontSize === "lg"
      ? "text-lg"
      : config.fontSize === "md"
        ? "text-base"
        : "text-sm";

  return (
    <div className="h-full p-1">
      <Textarea
        value={config.content}
        onChange={(e) => onConfigChange({ content: e.target.value })}
        placeholder="Type your notes here..."
        className={`h-full resize-none border-0 bg-transparent focus-visible:ring-0 ${fontSizeClass}`}
      />
    </div>
  );
}
