"use client";

import { useState } from "react";
import { type WidgetProps } from "../types";
import { type EmailTriageConfig } from "./config";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Mail,
  AlertTriangle,
  ArrowRight,
  Info,
  Archive,
  Clock,
} from "lucide-react";

type Priority = "High" | "Medium" | "Low";
type AILabel = "Urgent" | "Follow-up" | "FYI" | "Archive";

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  priority: Priority;
  aiLabel: AILabel;
  time: string;
  read: boolean;
}

const MOCK_EMAILS: Email[] = [
  {
    id: "1",
    sender: "David Chen",
    senderEmail: "d.chen@acmecorp.com",
    subject: "URGENT: Production deployment blocked",
    preview:
      "The CI pipeline is failing on the main branch. We need to resolve this before the 5pm release window.",
    priority: "High",
    aiLabel: "Urgent",
    time: "10 min ago",
    read: false,
  },
  {
    id: "2",
    sender: "Lisa Park",
    senderEmail: "lisa.park@company.com",
    subject: "Q2 Budget Review - Action Required",
    preview:
      "Please review the attached budget proposal and provide your feedback by Friday. Key changes to the engineering allocation.",
    priority: "High",
    aiLabel: "Follow-up",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    sender: "Marketing Team",
    senderEmail: "marketing@company.com",
    subject: "New brand guidelines published",
    preview:
      "The updated brand guidelines are now live on the internal wiki. Please review the new color palette and typography.",
    priority: "Medium",
    aiLabel: "FYI",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    sender: "GitHub",
    senderEmail: "notifications@github.com",
    subject: "PR #312 merged: Update widget framework",
    preview:
      "The pull request for the widget framework refactor has been merged into main. All checks passed.",
    priority: "Low",
    aiLabel: "FYI",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    sender: "Sarah Miller",
    senderEmail: "s.miller@company.com",
    subject: "Re: Client onboarding checklist",
    preview:
      "Thanks for sending over the checklist. I have a few questions about steps 3-5 that I'd like to discuss.",
    priority: "Medium",
    aiLabel: "Follow-up",
    time: "4 hours ago",
    read: true,
  },
  {
    id: "6",
    sender: "HR Department",
    senderEmail: "hr@company.com",
    subject: "Monthly newsletter - April",
    preview:
      "Welcome to the April newsletter! This month we celebrate team achievements and upcoming company events.",
    priority: "Low",
    aiLabel: "Archive",
    time: "5 hours ago",
    read: true,
  },
];

const priorityColors: Record<Priority, string> = {
  High: "bg-red-500/10 text-red-600 dark:text-red-400",
  Medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Low: "bg-green-500/10 text-green-600 dark:text-green-400",
};

const labelIcons: Record<AILabel, typeof AlertTriangle> = {
  Urgent: AlertTriangle,
  "Follow-up": ArrowRight,
  FYI: Info,
  Archive: Archive,
};

export default function EmailTriageWidget({
  config,
}: WidgetProps<EmailTriageConfig>) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredEmails = MOCK_EMAILS.filter((email) => {
    if (config.priorityThreshold === "high" && email.priority !== "High")
      return false;
    if (
      config.priorityThreshold === "medium" &&
      email.priority === "Low"
    )
      return false;
    if (activeTab === "all") return true;
    if (activeTab === "urgent")
      return email.aiLabel === "Urgent" || email.priority === "High";
    if (activeTab === "followup") return email.aiLabel === "Follow-up";
    if (activeTab === "fyi")
      return email.aiLabel === "FYI" || email.aiLabel === "Archive";
    return true;
  });

  return (
    <div className="flex flex-col h-full p-3 gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-primary" />
          <span className="text-sm font-semibold">Email Triage</span>
        </div>
        <Badge variant="secondary">
          {MOCK_EMAILS.filter((e) => !e.read).length} unread
        </Badge>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="followup">Follow-up</TabsTrigger>
          <TabsTrigger value="fyi">FYI</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="space-y-1.5 pr-2 pt-1">
              {filteredEmails.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-8">
                  No emails match the current filter
                </div>
              ) : (
                filteredEmails.map((email) => {
                  const LabelIcon = labelIcons[email.aiLabel];
                  return (
                    <div
                      key={email.id}
                      className={`rounded-lg border p-2.5 space-y-1 ${
                        !email.read
                          ? "bg-accent/50 border-primary/20"
                          : "bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {!email.read && (
                              <span className="size-1.5 rounded-full bg-primary shrink-0" />
                            )}
                            <span className="text-xs font-semibold truncate">
                              {email.sender}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                              <Clock className="size-2.5" />
                              {email.time}
                            </span>
                          </div>
                          <div className="text-xs font-medium truncate mt-0.5">
                            {email.subject}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {email.preview}
                      </p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${priorityColors[email.priority]}`}
                        >
                          {email.priority}
                        </span>
                        {config.autoLabel && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            <LabelIcon className="size-2.5" />
                            {email.aiLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
