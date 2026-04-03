"use client";

import { Sparkles, Star, Download, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { becomeCreator } from "@/lib/actions/user.actions";
import { toast } from "sonner";

interface CreatorSettingsProps {
  isCreator: boolean;
  username: string | null;
  listings: {
    id: string;
    title: string;
    type: string;
    downloadCount: number;
    avgRating: number;
    price: number;
    createdAt: Date;
  }[];
}

export function CreatorSettings({
  isCreator,
  username,
  listings,
}: CreatorSettingsProps) {
  const handleBecomeCreator = async () => {
    try {
      await becomeCreator();
      toast.success("You are now a creator!");
    } catch {
      toast.error("Failed to activate creator status");
    }
  };

  if (!isCreator) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-bold mb-2">Become a Creator</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Share your dashboards, widgets, and configs with the community.
            Publish to the marketplace and build your following.
          </p>
          {!username && (
            <p className="text-sm text-destructive mb-4">
              Set a username in your Profile first.
            </p>
          )}
          <Button onClick={handleBecomeCreator} disabled={!username}>
            <Sparkles className="h-4 w-4 mr-2" />
            Activate Creator Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalDownloads = listings.reduce((s, l) => s + l.downloadCount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Creator Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Package className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">{listings.length}</div>
              <div className="text-xs text-muted-foreground">Listings</div>
            </div>
            <div className="text-center">
              <Download className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">{totalDownloads}</div>
              <div className="text-xs text-muted-foreground">Installs</div>
            </div>
            <div className="text-center">
              <Star className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {listings.length > 0
                  ? (
                      listings.reduce((s, l) => s + l.avgRating, 0) /
                      listings.length
                    ).toFixed(1)
                  : "—"}
              </div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {listings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No listings yet. Publish a dashboard from its settings page.
            </p>
          ) : (
            <div className="space-y-3">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm">{listing.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {listing.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {listing.downloadCount} installs
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {listing.avgRating.toFixed(1)} stars
                      </span>
                    </div>
                  </div>
                  <Badge variant={listing.price === 0 ? "outline" : "default"}>
                    {listing.price === 0
                      ? "Free"
                      : `$${listing.price.toFixed(2)}`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
