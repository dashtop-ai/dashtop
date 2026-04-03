"use client";

import { useState } from "react";
import { type WidgetProps } from "../types";
import { type MeetingSummarizerConfig } from "./config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Mic,
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  attendees: number;
  status: "summarized" | "pending";
  summary?: string;
  keyPoints?: string[];
  actionItems?: { text: string; assignee: string }[];
}

const MOCK_MEETINGS: Meeting[] = [
  {
    id: "1",
    title: "Team Standup",
    date: "Today, 9:00 AM",
    duration: "15 min",
    attendees: 8,
    status: "summarized",
    summary:
      "Sprint progress reviewed. Frontend team ahead of schedule on dashboard components. Backend API integration delayed by one day due to auth changes.",
    keyPoints: [
      "Sprint velocity at 94% of target",
      "Dashboard widget framework complete",
      "Auth service migration in progress",
      "QA testing begins Thursday",
    ],
    actionItems: [
      { text: "Update API docs for new auth flow", assignee: "Sarah" },
      { text: "Review PR #247 for widget registry", assignee: "Mike" },
      { text: "Schedule load testing session", assignee: "Alex" },
    ],
  },
  {
    id: "2",
    title: "Product Review",
    date: "Today, 11:30 AM",
    duration: "45 min",
    attendees: 12,
    status: "summarized",
    summary:
      "Q2 roadmap adjustments discussed. Marketplace launch moved up to May. New AI features prioritized based on user feedback surveys.",
    keyPoints: [
      "Marketplace launch target: May 15",
      "User feedback strongly favors AI dashboard features",
      "Mobile responsive design added to Q2 scope",
      "Partnership discussions with 3 widget providers",
    ],
    actionItems: [
      { text: "Draft marketplace launch plan", assignee: "Jordan" },
      { text: "Finalize widget provider agreements", assignee: "Lisa" },
      { text: "Create mobile design mockups", assignee: "Chris" },
    ],
  },
  {
    id: "3",
    title: "Client Call - Acme Corp",
    date: "Yesterday, 2:00 PM",
    duration: "30 min",
    attendees: 5,
    status: "pending",
    summary: undefined,
    keyPoints: undefined,
    actionItems: undefined,
  },
];

export default function MeetingSummarizerWidget({
  config,
}: WidgetProps<MeetingSummarizerConfig>) {
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const handleSummarize = (id: string) => {
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: "summarized" as const,
              summary:
                "Client expressed interest in enterprise dashboard features. Custom widget development timeline discussed. Follow-up demo scheduled for next week.",
              keyPoints: [
                "Enterprise tier pricing approved",
                "Custom branding requirements documented",
                "Integration with client SSO needed",
                "Demo scheduled for April 8",
              ],
              actionItems: [
                { text: "Prepare enterprise demo environment", assignee: "Mike" },
                { text: "Send SSO integration docs", assignee: "Sarah" },
                { text: "Draft enterprise pricing proposal", assignee: "Jordan" },
              ],
            }
          : m
      )
    );
    setExpandedId(id);
  };

  return (
    <div className="flex flex-col h-full p-3 gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="size-4 text-primary" />
          <span className="text-sm font-semibold">Recent Meetings</span>
        </div>
        <Badge variant="secondary">{meetings.length} meetings</Badge>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-2">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="rounded-lg border bg-card p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {meeting.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {meeting.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {meeting.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {meeting.attendees}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {meeting.status === "summarized" ? (
                    <Badge variant="secondary">
                      <CheckCircle2 className="size-3" />
                      Summarized
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs px-2"
                      onClick={() => handleSummarize(meeting.id)}
                    >
                      <Sparkles className="size-3" />
                      Summarize
                    </Button>
                  )}
                  {meeting.status === "summarized" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        setExpandedId(
                          expandedId === meeting.id ? null : meeting.id
                        )
                      }
                    >
                      {expandedId === meeting.id ? (
                        <ChevronUp className="size-3.5" />
                      ) : (
                        <ChevronDown className="size-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              {expandedId === meeting.id && meeting.status === "summarized" && (
                <div className="space-y-2 pt-1">
                  <Separator />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {meeting.summary}
                  </p>
                  {meeting.keyPoints && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Key Points</div>
                      <ul className="space-y-0.5">
                        {meeting.keyPoints.map((point, i) => (
                          <li
                            key={i}
                            className="text-xs text-muted-foreground flex items-start gap-1.5"
                          >
                            <span className="text-primary mt-0.5">*</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {config.includeActionItems && meeting.actionItems && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Action Items</div>
                      <ul className="space-y-0.5">
                        {meeting.actionItems.map((item, i) => (
                          <li
                            key={i}
                            className="text-xs text-muted-foreground flex items-start gap-1.5"
                          >
                            <CheckCircle2 className="size-3 text-green-500 mt-0.5 shrink-0" />
                            <span>
                              {item.text}{" "}
                              <span className="text-primary font-medium">
                                @{item.assignee}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
