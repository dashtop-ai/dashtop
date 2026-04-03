"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bug,
  Lightbulb,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";

type FeedbackType = "bug" | "feature" | "suggestion";

interface FeedbackItem {
  id: string;
  type: FeedbackType;
  title: string;
  description: string;
  widget: string;
  user: string;
  status: string;
  date: string;
  response?: string;
}

const feedbackItems: FeedbackItem[] = [
  {
    id: "1",
    type: "bug",
    title: "Widget crashes on resize below 200px",
    description:
      "When resizing the Weather Dashboard Pro widget below 200px width, the entire widget crashes and shows a blank white screen. The console shows a TypeError related to canvas rendering. This happens consistently on Chrome and Firefox.",
    widget: "Weather Dashboard Pro",
    user: "David Park",
    status: "new",
    date: "1 hour ago",
  },
  {
    id: "2",
    type: "feature",
    title: "Add dark/light toggle per widget",
    description:
      "It would be great to have an individual dark/light mode toggle for each widget instance rather than having it follow the global theme. This would let users mix themes on their dashboard.",
    widget: "Stock Ticker Widget",
    user: "Lisa Nguyen",
    status: "new",
    date: "3 hours ago",
  },
  {
    id: "3",
    type: "suggestion",
    title: "Support for multiple timezones",
    description:
      "The World Clock Widget currently only supports one timezone display. It would be nice to show multiple timezones side by side, similar to how the iOS Clock app works.",
    widget: "World Clock Widget",
    user: "Tom Richards",
    status: "in-progress",
    date: "6 hours ago",
  },
  {
    id: "4",
    type: "bug",
    title: "API key validation fails silently",
    description:
      "When entering an invalid API key in the AI Chat Companion settings, there is no error message shown to the user. The widget just silently fails to load any data. Should show a clear error.",
    widget: "AI Chat Companion",
    user: "Rachel Green",
    status: "new",
    date: "1 day ago",
  },
  {
    id: "5",
    type: "feature",
    title: "Export data to CSV",
    description:
      "As a power user, I would like the ability to export all my task data from the Task Manager Pro widget to a CSV file for backup or analysis in other tools.",
    widget: "Task Manager Pro",
    user: "Chris Taylor",
    status: "resolved",
    date: "2 days ago",
    response:
      "This feature has been added in v1.2.1. You can find the export button in the widget settings menu.",
  },
  {
    id: "6",
    type: "bug",
    title: "Duplicate notifications on data refresh",
    description:
      "Every time the stock data refreshes, I get a duplicate notification. This happens about every 30 seconds and is quite annoying.",
    widget: "Stock Ticker Widget",
    user: "Amy Zhang",
    status: "new",
    date: "3 days ago",
  },
  {
    id: "7",
    type: "suggestion",
    title: "Add keyboard shortcut support",
    description:
      "Being able to navigate tasks with keyboard shortcuts (j/k for up/down, x to complete, e to edit) would be a huge productivity boost.",
    widget: "Task Manager Pro",
    user: "Ben Howard",
    status: "new",
    date: "4 days ago",
  },
];

function feedbackIcon(type: FeedbackType) {
  switch (type) {
    case "bug":
      return <Bug className="h-4 w-4 text-destructive" />;
    case "feature":
      return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
  }
}

function typeBadgeVariant(type: FeedbackType) {
  switch (type) {
    case "bug":
      return "destructive" as const;
    case "feature":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function statusBadgeVariant(status: string) {
  switch (status) {
    case "new":
      return "default" as const;
    case "in-progress":
      return "secondary" as const;
    case "resolved":
      return "outline" as const;
    default:
      return "outline" as const;
  }
}

function FeedbackCard({ item }: { item: FeedbackItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border p-4 space-y-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{feedbackIcon(item.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">{item.title}</h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{item.widget}</span>
                <span>by {item.user}</span>
                <span>{item.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={typeBadgeVariant(item.type)}>{item.type}</Badge>
              <Badge variant={statusBadgeVariant(item.status)}>
                {item.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-3 w-3" /> Hide details
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3" /> Show details
          </>
        )}
      </button>

      {expanded && (
        <div className="space-y-3 pt-1">
          <p className="text-sm text-muted-foreground">{item.description}</p>

          {item.response && (
            <div className="rounded-md bg-muted/50 p-3 space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                Your Response
              </div>
              <p className="text-sm">{item.response}</p>
            </div>
          )}

          {!item.response && (
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a response..."
                className="min-h-16 text-sm"
              />
              <Button size="icon" className="shrink-0 self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  const bugCount = feedbackItems.filter((f) => f.type === "bug").length;
  const featureCount = feedbackItems.filter((f) => f.type === "feature").length;
  const suggestionCount = feedbackItems.filter(
    (f) => f.type === "suggestion"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feedback Inbox</h1>
        <p className="text-muted-foreground">
          Review and respond to user feedback across your widgets.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-lg font-bold">{feedbackItems.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <Bug className="h-5 w-5 text-destructive" />
            <div>
              <div className="text-lg font-bold">{bugCount}</div>
              <div className="text-xs text-muted-foreground">Bugs</div>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-lg font-bold">{featureCount}</div>
              <div className="text-xs text-muted-foreground">Features</div>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-lg font-bold">{suggestionCount}</div>
              <div className="text-xs text-muted-foreground">Suggestions</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed feedback list */}
      <Tabs defaultValue="all">
        <TabsList variant="line">
          <TabsTrigger value="all">All ({feedbackItems.length})</TabsTrigger>
          <TabsTrigger value="bugs">Bugs ({bugCount})</TabsTrigger>
          <TabsTrigger value="features">Features ({featureCount})</TabsTrigger>
          <TabsTrigger value="suggestions">
            Suggestions ({suggestionCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {feedbackItems.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </TabsContent>

        <TabsContent value="bugs" className="mt-4 space-y-3">
          {feedbackItems
            .filter((f) => f.type === "bug")
            .map((item) => (
              <FeedbackCard key={item.id} item={item} />
            ))}
        </TabsContent>

        <TabsContent value="features" className="mt-4 space-y-3">
          {feedbackItems
            .filter((f) => f.type === "feature")
            .map((item) => (
              <FeedbackCard key={item.id} item={item} />
            ))}
        </TabsContent>

        <TabsContent value="suggestions" className="mt-4 space-y-3">
          {feedbackItems
            .filter((f) => f.type === "suggestion")
            .map((item) => (
              <FeedbackCard key={item.id} item={item} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
