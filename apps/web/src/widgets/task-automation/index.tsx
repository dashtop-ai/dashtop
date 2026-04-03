"use client";

import { useState } from "react";
import { type WidgetProps } from "../types";
import { type TaskAutomationConfig } from "./config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Plus,
  FileBarChart,
  MessageSquare,
  Receipt,
  Mail,
  Database,
  Clock,
} from "lucide-react";

interface Automation {
  id: string;
  name: string;
  description: string;
  icon: typeof FileBarChart;
  active: boolean;
  lastRun: string;
  successRate: number;
  runCount: number;
}

const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "1",
    name: "Daily Report Generation",
    description: "Compiles KPIs and sends summary to leadership",
    icon: FileBarChart,
    active: true,
    lastRun: "Today, 8:00 AM",
    successRate: 98,
    runCount: 127,
  },
  {
    id: "2",
    name: "Slack Channel Summary",
    description: "Summarizes key messages from team channels",
    icon: MessageSquare,
    active: true,
    lastRun: "Today, 9:30 AM",
    successRate: 95,
    runCount: 84,
  },
  {
    id: "3",
    name: "Invoice Processing",
    description: "Extracts data from invoices and updates accounting",
    icon: Receipt,
    active: false,
    lastRun: "Yesterday, 4:15 PM",
    successRate: 92,
    runCount: 56,
  },
  {
    id: "4",
    name: "Email Follow-up Reminders",
    description: "Detects unanswered emails and creates reminders",
    icon: Mail,
    active: true,
    lastRun: "Today, 10:00 AM",
    successRate: 100,
    runCount: 203,
  },
  {
    id: "5",
    name: "Data Backup Verification",
    description: "Validates daily backup integrity and alerts on failures",
    icon: Database,
    active: true,
    lastRun: "Today, 6:00 AM",
    successRate: 99,
    runCount: 365,
  },
];

export default function TaskAutomationWidget({
  config,
}: WidgetProps<TaskAutomationConfig>) {
  const [automations, setAutomations] = useState(MOCK_AUTOMATIONS);

  const activeCount = automations.filter((a) => a.active).length;

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const newActive = !a.active;
        const currentActive = prev.filter(
          (x) => x.active && x.id !== id
        ).length;
        if (newActive && currentActive >= config.maxConcurrent) return a;
        return { ...a, active: newActive };
      })
    );
  };

  return (
    <div className="flex flex-col h-full p-3 gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-primary" />
          <span className="text-sm font-semibold">Automations</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {activeCount}/{config.maxConcurrent} active
          </Badge>
          <Button size="sm" variant="outline" className="h-6 text-xs px-2">
            <Plus className="size-3" />
            New
          </Button>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-2">
          {automations.map((automation) => {
            const Icon = automation.icon;
            return (
              <div
                key={automation.id}
                className="rounded-lg border bg-card p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className="rounded-md bg-muted p-1.5 shrink-0">
                      <Icon className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {automation.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {automation.description}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={automation.active}
                    onCheckedChange={() => toggleAutomation(automation.id)}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-2.5" />
                    {automation.lastRun}
                  </span>
                  <span>{automation.runCount} runs</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Success rate</span>
                    <span
                      className={
                        automation.successRate >= 95
                          ? "text-green-600 dark:text-green-400"
                          : automation.successRate >= 80
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                      }
                    >
                      {automation.successRate}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        automation.successRate >= 95
                          ? "bg-green-500"
                          : automation.successRate >= 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${automation.successRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
