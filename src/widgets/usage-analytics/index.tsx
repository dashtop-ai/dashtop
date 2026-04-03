"use client";

import { useMemo } from "react";
import { BarChart3, TrendingUp, DollarSign, Zap } from "lucide-react";
import { type WidgetProps } from "../types";
import { type UsageAnalyticsConfig } from "./config";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DailyUsage {
  label: string;
  tokens: number;
  cost: number;
}

function generateMockData(timeRange: string): DailyUsage[] {
  const days = timeRange === "90d" ? 90 : timeRange === "30d" ? 30 : 7;
  const data: DailyUsage[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayLabel =
      days <= 7
        ? date.toLocaleDateString("en-US", { weekday: "short" })
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const baseTokens = 8000 + Math.random() * 40000;
    const tokens = Math.round(baseTokens);
    const cost = tokens * 0.00003;

    data.push({ label: dayLabel, tokens, cost });
  }

  return data;
}

export default function UsageAnalyticsWidget({
  config,
}: WidgetProps<UsageAnalyticsConfig>) {
  const data = useMemo(
    () => generateMockData(config.timeRange),
    [config.timeRange]
  );

  const displayData = useMemo(() => {
    if (config.timeRange === "7d") return data;
    if (config.timeRange === "30d") {
      // Show last 10 data points for 30d
      const step = Math.floor(data.length / 10);
      return data.filter((_, i) => i % step === 0).slice(0, 10);
    }
    // 90d: show last 12 data points
    const step = Math.floor(data.length / 12);
    return data.filter((_, i) => i % step === 0).slice(0, 12);
  }, [data, config.timeRange]);

  const totalTokens = data.reduce((sum, d) => sum + d.tokens, 0);
  const totalCost = data.reduce((sum, d) => sum + d.cost, 0);
  const avgPerDay = Math.round(totalTokens / data.length);
  const maxTokens = Math.max(...displayData.map((d) => d.tokens));

  const rangeLabel =
    config.timeRange === "90d"
      ? "Last 90 days"
      : config.timeRange === "30d"
        ? "Last 30 days"
        : "Last 7 days";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-primary" />
          <span className="text-sm font-medium">Usage Analytics</span>
        </div>
        <span className="text-xs text-muted-foreground">{rangeLabel}</span>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-muted/50 p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="size-3 text-yellow-500" />
                <span className="text-xs text-muted-foreground">
                  Total Tokens
                </span>
              </div>
              <span className="text-sm font-semibold">
                {totalTokens >= 1000000
                  ? `${(totalTokens / 1000000).toFixed(1)}M`
                  : `${(totalTokens / 1000).toFixed(0)}K`}
              </span>
            </div>

            {config.showCost && (
              <div className="rounded-lg bg-muted/50 p-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="size-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    Total Cost
                  </span>
                </div>
                <span className="text-sm font-semibold">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
            )}

            <div className="rounded-lg bg-muted/50 p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="size-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">Avg/Day</span>
              </div>
              <span className="text-sm font-semibold">
                {avgPerDay >= 1000
                  ? `${(avgPerDay / 1000).toFixed(1)}K`
                  : avgPerDay}
              </span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              Daily Token Usage
            </span>
            <div className="flex items-end gap-1 h-28">
              {displayData.map((day, i) => {
                const height =
                  maxTokens > 0
                    ? Math.max((day.tokens / maxTokens) * 100, 4)
                    : 4;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="w-full flex items-end justify-center h-24">
                      <div
                        className="w-full max-w-6 rounded-t bg-primary/80 hover:bg-primary transition-colors"
                        style={{ height: `${height}%` }}
                        title={`${day.label}: ${day.tokens.toLocaleString()} tokens${config.showCost ? ` ($${day.cost.toFixed(2)})` : ""}`}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
