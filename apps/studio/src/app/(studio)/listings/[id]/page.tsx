"use client";

import { use } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Save,
  Star,
  Download,
  DollarSign,
  TrendingUp,
} from "lucide-react";

// Mock listing data
const mockListing = {
  id: "1",
  title: "Weather Dashboard Pro",
  description:
    "A comprehensive weather widget with real-time forecasts, radar maps, and severe weather alerts. Supports multiple locations and customizable layouts.",
  longDescription:
    "Weather Dashboard Pro provides detailed 7-day forecasts, hourly breakdowns, radar maps, and severe weather alerts for any location worldwide. Built with performance in mind, it uses efficient caching to minimize API calls while keeping data fresh.",
  type: "widget",
  category: "Productivity",
  tags: ["weather", "forecast", "dashboard", "real-time"],
  price: 4.99,
  pricingModel: "paid",
  version: "2.1.0",
  downloads: 4231,
  avgRating: 4.8,
  reviewCount: 127,
  revenue: 1240.0,
  isPublished: true,
};

const downloadData = [
  { day: "Mar 1", count: 120 },
  { day: "Mar 5", count: 145 },
  { day: "Mar 10", count: 98 },
  { day: "Mar 15", count: 210 },
  { day: "Mar 20", count: 178 },
  { day: "Mar 25", count: 195 },
  { day: "Mar 30", count: 230 },
];

const reviews = [
  {
    id: "1",
    user: "Alex Chen",
    rating: 5,
    comment: "Excellent widget. Clean design and very responsive.",
    date: "2 hours ago",
  },
  {
    id: "2",
    user: "Sarah Kim",
    rating: 4,
    comment: "Great real-time data. Would love more customization options.",
    date: "5 hours ago",
  },
  {
    id: "3",
    user: "Mike Johnson",
    rating: 5,
    comment: "Best weather widget on the marketplace.",
    date: "1 day ago",
  },
  {
    id: "4",
    user: "Emma Wilson",
    rating: 3,
    comment: "Functional but could use better mobile support.",
    date: "2 days ago",
  },
];

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const maxDownloads = Math.max(...downloadData.map((d) => d.count));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/listings" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {mockListing.title}
          </h1>
          <p className="text-muted-foreground">
            Edit listing details and view performance
          </p>
        </div>
        <Badge
          variant={mockListing.isPublished ? "default" : "secondary"}
        >
          {mockListing.isPublished ? "Published" : "Draft"}
        </Badge>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <Download className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-lg font-bold">
                {mockListing.downloads.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Downloads</div>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            <div>
              <div className="text-lg font-bold">{mockListing.avgRating}</div>
              <div className="text-xs text-muted-foreground">
                Avg Rating ({mockListing.reviewCount} reviews)
              </div>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-lg font-bold">
                ${mockListing.revenue.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 pt-4">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <div>
              <div className="text-lg font-bold">+18%</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Edit form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Listing Details</CardTitle>
              <CardDescription>
                Update your listing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  defaultValue={mockListing.title}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  defaultValue={mockListing.description}
                  className="min-h-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longDescription">Full Description</Label>
                <Textarea
                  id="longDescription"
                  defaultValue={mockListing.longDescription}
                  className="min-h-32"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    defaultValue={mockListing.price}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    defaultValue={mockListing.category}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  defaultValue={mockListing.tags.join(", ")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  defaultValue={mockListing.version}
                />
              </div>
            </CardContent>
          </Card>

          {/* Downloads chart */}
          <Card>
            <CardHeader>
              <CardTitle>Downloads Over Time</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-40">
                {downloadData.map((d) => (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-[10px] text-muted-foreground">
                      {d.count}
                    </span>
                    <div
                      className="w-full rounded-t bg-primary/80 transition-all"
                      style={{
                        height: `${(d.count / maxDownloads) * 100}%`,
                        minHeight: "4px",
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {d.day.split(" ")[1]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                {mockListing.reviewCount} total reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review, idx) => (
                <div key={review.id}>
                  {idx > 0 && <Separator className="mb-4" />}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {review.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {review.user}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
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
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
