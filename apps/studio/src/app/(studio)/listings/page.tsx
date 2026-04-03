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
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  EyeOff,
  Star,
  Download,
  DollarSign,
} from "lucide-react";

// Mock listings data
const listings = [
  {
    id: "1",
    title: "Weather Dashboard Pro",
    type: "widget",
    downloads: 4231,
    rating: 4.8,
    reviewCount: 127,
    revenue: "$1,240.00",
    status: "published",
    version: "2.1.0",
    updatedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Stock Ticker Widget",
    type: "widget",
    downloads: 3102,
    rating: 4.5,
    reviewCount: 89,
    revenue: "$890.00",
    status: "published",
    version: "1.4.2",
    updatedAt: "1 week ago",
  },
  {
    id: "3",
    title: "AI Chat Companion",
    type: "widget",
    downloads: 2845,
    rating: 4.9,
    reviewCount: 201,
    revenue: "$650.00",
    status: "published",
    version: "3.0.1",
    updatedAt: "3 days ago",
  },
  {
    id: "4",
    title: "Task Manager Pro",
    type: "widget",
    downloads: 1523,
    rating: 4.2,
    reviewCount: 45,
    revenue: "$320.00",
    status: "published",
    version: "1.2.0",
    updatedAt: "5 days ago",
  },
  {
    id: "5",
    title: "Productivity Dashboard",
    type: "dashboard",
    downloads: 876,
    rating: 4.6,
    reviewCount: 32,
    revenue: "$140.00",
    status: "published",
    version: "1.0.0",
    updatedAt: "1 week ago",
  },
  {
    id: "6",
    title: "World Clock Widget",
    type: "widget",
    downloads: 270,
    rating: 3.8,
    reviewCount: 12,
    revenue: "$0.00",
    status: "draft",
    version: "0.9.0",
    updatedAt: "2 weeks ago",
  },
];

function statusBadgeVariant(status: string) {
  switch (status) {
    case "published":
      return "default" as const;
    case "draft":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

export default function ListingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Listings</h1>
          <p className="text-muted-foreground">
            Manage your marketplace widgets and dashboards.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Listing
        </Button>
      </div>

      {/* Listings table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                    Downloads
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <Link
                          href={`/listings/${listing.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {listing.title}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          v{listing.version} -- Updated {listing.updatedAt}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{listing.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm">
                        <Download className="h-3 w-3 text-muted-foreground" />
                        {listing.downloads.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {listing.rating}
                        <span className="text-muted-foreground">
                          ({listing.reviewCount})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        {listing.revenue}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(listing.status)}>
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          render={<Link href={`/listings/${listing.id}`} />}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-xs">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-xs">
                          <EyeOff className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
