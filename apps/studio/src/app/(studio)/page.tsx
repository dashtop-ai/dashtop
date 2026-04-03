import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  DollarSign,
  Star,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Bug,
  Lightbulb,
} from "lucide-react";

// Mock data for the overview
const stats = [
  {
    label: "Total Downloads",
    value: "12,847",
    change: "+12.5%",
    trend: "up" as const,
    icon: Download,
  },
  {
    label: "Total Revenue",
    value: "$3,240.00",
    change: "+8.2%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    label: "Avg Rating",
    value: "4.7",
    change: "+0.2",
    trend: "up" as const,
    icon: Star,
  },
  {
    label: "Active Listings",
    value: "8",
    change: "-1",
    trend: "down" as const,
    icon: Package,
  },
];

const recentReviews = [
  {
    id: "1",
    user: "Alex Chen",
    avatar: null,
    listing: "Weather Dashboard Pro",
    rating: 5,
    comment: "Excellent widget. Clean design and very responsive.",
    date: "2 hours ago",
  },
  {
    id: "2",
    user: "Sarah Kim",
    avatar: null,
    listing: "Stock Ticker Widget",
    rating: 4,
    comment: "Great real-time data. Would love more customization options.",
    date: "5 hours ago",
  },
  {
    id: "3",
    user: "Mike Johnson",
    avatar: null,
    listing: "AI Chat Companion",
    rating: 5,
    comment: "Best AI widget on the marketplace. Period.",
    date: "1 day ago",
  },
  {
    id: "4",
    user: "Emma Wilson",
    avatar: null,
    listing: "Task Manager Pro",
    rating: 3,
    comment: "Functional but could use better keyboard shortcuts.",
    date: "2 days ago",
  },
  {
    id: "5",
    user: "James Lee",
    avatar: null,
    listing: "Weather Dashboard Pro",
    rating: 4,
    comment: "Solid weather widget with accurate forecasts.",
    date: "3 days ago",
  },
];

const recentFeedback = [
  {
    id: "1",
    type: "bug",
    title: "Widget crashes on resize below 200px",
    widget: "Weather Dashboard Pro",
    user: "David Park",
    date: "1 hour ago",
  },
  {
    id: "2",
    type: "feature",
    title: "Add dark/light toggle per widget",
    widget: "Stock Ticker Widget",
    user: "Lisa Nguyen",
    date: "3 hours ago",
  },
  {
    id: "3",
    type: "suggestion",
    title: "Support for multiple timezones",
    widget: "World Clock Widget",
    user: "Tom Richards",
    date: "6 hours ago",
  },
  {
    id: "4",
    type: "bug",
    title: "API key validation fails silently",
    widget: "AI Chat Companion",
    user: "Rachel Green",
    date: "1 day ago",
  },
  {
    id: "5",
    type: "feature",
    title: "Export data to CSV",
    widget: "Task Manager Pro",
    user: "Chris Taylor",
    date: "2 days ago",
  },
];

function feedbackIcon(type: string) {
  switch (type) {
    case "bug":
      return <Bug className="h-4 w-4 text-destructive" />;
    case "feature":
      return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
  }
}

function feedbackBadgeVariant(type: string) {
  switch (type) {
    case "bug":
      return "destructive" as const;
    case "feature":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, Creator
        </h1>
        <p className="text-muted-foreground">
          Here is an overview of your marketplace performance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                {stat.label}
              </CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={
                    stat.trend === "up"
                      ? "text-emerald-500"
                      : "text-destructive"
                  }
                >
                  {stat.change}
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent reviews and feedback */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>
              Latest reviews across your listings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReviews.map((review, idx) => (
              <div key={review.id}>
                {idx > 0 && <Separator className="mb-4" />}
                <div className="flex items-start gap-3">
                  <Avatar size="sm">
                    {review.avatar && <AvatarImage src={review.avatar} />}
                    <AvatarFallback>
                      {review.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {review.user}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        on {review.listing}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>
              Bugs, features, and suggestions from users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentFeedback.map((item, idx) => (
              <div key={item.id}>
                {idx > 0 && <Separator className="mb-4" />}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{feedbackIcon(item.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium line-clamp-1">
                        {item.title}
                      </span>
                      <Badge variant={feedbackBadgeVariant(item.type)}>
                        {item.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.widget}</span>
                      <span>by {item.user}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
