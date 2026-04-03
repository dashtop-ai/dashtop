"use client";

import { useMemo } from "react";
import { type WidgetProps } from "../types";
import { type CalendarAiConfig } from "./config";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Sparkles,
  AlertTriangle,
  FileText,
  ArrowRightLeft,
  Clock,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  day: number; // 0=Mon, 1=Tue, ...
  aiSuggestion?: { type: "prep" | "conflict" | "reschedule"; text: string };
}

function getWeekDates(): { label: string; short: string; date: number; isToday: boolean }[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isToday = d.toDateString() === now.toDateString();
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      short: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      isToday,
    };
  });
}

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    time: "9:00 AM",
    duration: "15m",
    day: 0,
    aiSuggestion: { type: "prep", text: "Prep notes available" },
  },
  {
    id: "2",
    title: "Design Review",
    time: "11:00 AM",
    duration: "1h",
    day: 0,
  },
  {
    id: "3",
    title: "1:1 with Manager",
    time: "2:00 PM",
    duration: "30m",
    day: 1,
    aiSuggestion: { type: "prep", text: "Talking points prepared" },
  },
  {
    id: "4",
    title: "Sprint Planning",
    time: "10:00 AM",
    duration: "2h",
    day: 2,
    aiSuggestion: { type: "conflict", text: "Conflict with lunch slot" },
  },
  {
    id: "5",
    title: "Client Demo",
    time: "3:00 PM",
    duration: "1h",
    day: 2,
    aiSuggestion: { type: "prep", text: "Demo script ready" },
  },
  {
    id: "6",
    title: "Product Sync",
    time: "9:30 AM",
    duration: "45m",
    day: 3,
  },
  {
    id: "7",
    title: "Interview - Sr. Engineer",
    time: "1:00 PM",
    duration: "1h",
    day: 3,
    aiSuggestion: { type: "prep", text: "Resume summary available" },
  },
  {
    id: "8",
    title: "All Hands",
    time: "4:00 PM",
    duration: "1h",
    day: 3,
    aiSuggestion: { type: "reschedule", text: "Suggest reschedule - packed day" },
  },
  {
    id: "9",
    title: "Retrospective",
    time: "10:00 AM",
    duration: "1h",
    day: 4,
  },
  {
    id: "10",
    title: "Focus Time",
    time: "1:00 PM",
    duration: "3h",
    day: 4,
  },
];

const suggestionConfig = {
  prep: {
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  conflict: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  reschedule: {
    icon: ArrowRightLeft,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
  },
};

export default function CalendarAiWidget({
  config,
}: WidgetProps<CalendarAiConfig>) {
  const weekDates = useMemo(getWeekDates, []);

  const aiSuggestions = MOCK_EVENTS.filter((e) => e.aiSuggestion);

  return (
    <div className="flex flex-col h-full p-3 gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <span className="text-sm font-semibold">Calendar AI</span>
        </div>
        <Badge variant="secondary">
          {aiSuggestions.length} suggestions
        </Badge>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-2">
          {/* Weekly Calendar Grid */}
          <div className="grid grid-cols-5 gap-1">
            {weekDates.map((day, dayIndex) => (
              <div key={dayIndex} className="space-y-1">
                <div
                  className={`text-center p-1 rounded-md ${
                    day.isToday
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="text-[10px] font-medium">{day.short}</div>
                  <div className="text-sm font-bold">{day.date}</div>
                </div>
                <div className="space-y-0.5">
                  {MOCK_EVENTS.filter((e) => e.day === dayIndex).map(
                    (event) => (
                      <div
                        key={event.id}
                        className={`rounded p-1 text-[10px] border ${
                          event.aiSuggestion
                            ? event.aiSuggestion.type === "conflict"
                              ? "border-amber-500/30 bg-amber-500/5"
                              : event.aiSuggestion.type === "reschedule"
                                ? "border-purple-500/30 bg-purple-500/5"
                                : "border-blue-500/30 bg-blue-500/5"
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="font-medium truncate">
                          {event.title}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-0.5">
                          <Clock className="size-2" />
                          {event.time}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* AI Suggestions */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3 text-primary" />
              <span className="text-xs font-medium">AI Suggestions</span>
            </div>
            {aiSuggestions.map((event) => {
              const suggestion = event.aiSuggestion!;
              const cfg = suggestionConfig[suggestion.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={event.id}
                  className={`rounded-lg ${cfg.bg} p-2 flex items-start gap-2`}
                >
                  <Icon className={`size-3.5 ${cfg.color} shrink-0 mt-0.5`} />
                  <div className="min-w-0">
                    <div className="text-xs font-medium">{event.title}</div>
                    <div className={`text-[10px] ${cfg.color}`}>
                      {suggestion.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
