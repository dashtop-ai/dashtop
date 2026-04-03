"use client";

import { useState, useEffect } from "react";
import { type WidgetProps } from "../types";
import { type ClockConfig } from "./config";

export default function ClockWidget({
  config,
}: WidgetProps<ClockConfig>) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !config.format24h,
    };
    if (config.showSeconds) options.second = "2-digit";
    if (config.timezone !== "local") options.timeZone = config.timezone;
    return time.toLocaleTimeString(undefined, options);
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (config.timezone !== "local") options.timeZone = config.timezone;
    return time.toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <div className="text-4xl font-bold tracking-tight font-mono">
        {formatTime()}
      </div>
      {config.showDate && (
        <div className="text-sm text-muted-foreground">{formatDate()}</div>
      )}
    </div>
  );
}
