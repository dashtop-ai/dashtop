import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  TrendingUp,
  Eye,
  Users,
} from "lucide-react";

// Mock 30-day download data
const dailyDownloads = [
  42, 38, 55, 47, 62, 58, 71, 65, 49, 73,
  68, 81, 75, 62, 89, 95, 87, 72, 91, 103,
  97, 85, 110, 98, 115, 108, 121, 99, 130, 125,
];

const topListings = [
  {
    name: "Weather Dashboard Pro",
    downloads: 4231,
    views: 12450,
    conversionRate: "34%",
    trend: "+18%",
  },
  {
    name: "AI Chat Companion",
    downloads: 2845,
    views: 9870,
    conversionRate: "29%",
    trend: "+24%",
  },
  {
    name: "Stock Ticker Widget",
    downloads: 3102,
    views: 8920,
    conversionRate: "35%",
    trend: "+12%",
  },
  {
    name: "Task Manager Pro",
    downloads: 1523,
    views: 5640,
    conversionRate: "27%",
    trend: "+8%",
  },
  {
    name: "Productivity Dashboard",
    downloads: 876,
    views: 3210,
    conversionRate: "27%",
    trend: "+5%",
  },
];

const listingBreakdown = [
  { name: "Weather Dashboard Pro", downloads: 1840, percentage: 33 },
  { name: "Stock Ticker Widget", downloads: 1290, percentage: 23 },
  { name: "AI Chat Companion", downloads: 1180, percentage: 21 },
  { name: "Task Manager Pro", downloads: 720, percentage: 13 },
  { name: "Others", downloads: 550, percentage: 10 },
];

export default function AnalyticsPage() {
  const maxDownload = Math.max(...dailyDownloads);
  const totalDownloads = dailyDownloads.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track performance across all your listings.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              30-Day Downloads
            </CardDescription>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDownloads.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              +15.3% vs previous period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Page Views
            </CardDescription>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40,090</div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              +11.2% vs previous period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Unique Users
            </CardDescription>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,274</div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              +9.8% vs previous period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Avg Conversion
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30.4%</div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              +2.1% vs previous period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Downloads chart */}
      <Card>
        <CardHeader>
          <CardTitle>Downloads - Last 30 Days</CardTitle>
          <CardDescription>
            Daily download count across all listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-[3px] h-48">
            {dailyDownloads.map((count, i) => (
              <div
                key={i}
                className="group relative flex-1 flex flex-col items-center"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background whitespace-nowrap z-10">
                  Day {i + 1}: {count}
                </div>
                <div
                  className="w-full rounded-t bg-primary/70 hover:bg-primary transition-colors cursor-default"
                  style={{
                    height: `${(count / maxDownload) * 100}%`,
                    minHeight: "2px",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>Day 1</span>
            <span>Day 10</span>
            <span>Day 20</span>
            <span>Day 30</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Breakdown by listing */}
        <Card>
          <CardHeader>
            <CardTitle>Downloads by Listing</CardTitle>
            <CardDescription>
              Distribution of downloads this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {listingBreakdown.map((listing) => (
              <div key={listing.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{listing.name}</span>
                  <span className="text-muted-foreground">
                    {listing.downloads.toLocaleString()} ({listing.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${listing.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top performing */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Widgets</CardTitle>
            <CardDescription>Ranked by downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topListings.map((listing, idx) => (
                <div
                  key={listing.name}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {listing.name}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{listing.downloads.toLocaleString()} downloads</span>
                      <span>{listing.views.toLocaleString()} views</span>
                      <span>{listing.conversionRate} CVR</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{listing.trend}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
