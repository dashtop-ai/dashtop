import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Download, Package } from "lucide-react";

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const creator = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      isCreator: true,
      createdAt: true,
      marketplaceListings: {
        where: { isPublished: true },
        orderBy: { downloadCount: "desc" },
        include: {
          creator: { select: { name: true, username: true } },
        },
      },
    },
  });

  if (!creator || !creator.isCreator) notFound();

  const totalDownloads = creator.marketplaceListings.reduce(
    (sum, l) => sum + l.downloadCount,
    0
  );
  const avgRating =
    creator.marketplaceListings.length > 0
      ? creator.marketplaceListings.reduce((sum, l) => sum + l.avgRating, 0) /
        creator.marketplaceListings.length
      : 0;

  const initials =
    creator.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "C";

  return (
    <div>
      {/* Profile header */}
      <div className="flex items-start gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={creator.image || undefined} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{creator.name}</h1>
          <p className="text-muted-foreground text-sm">@{creator.username}</p>
          {creator.bio && (
            <p className="text-sm mt-2 max-w-xl">{creator.bio}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              {creator.marketplaceListings.length} listing
              {creator.marketplaceListings.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {totalDownloads} total installs
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {avgRating.toFixed(1)} avg rating
            </span>
          </div>
        </div>
      </div>

      {/* Listings */}
      <h2 className="text-lg font-semibold mb-4">Published Listings</h2>
      {creator.marketplaceListings.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No published listings yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creator.marketplaceListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/marketplace/listing/${listing.id}`}
            >
              <Card className="hover:border-primary/50 transition-colors h-full">
                <div className="h-24 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg" />
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {listing.type}
                    </Badge>
                    <Badge
                      variant={listing.price === 0 ? "outline" : "default"}
                      className="text-xs"
                    >
                      {listing.price === 0
                        ? "Free"
                        : `$${listing.price.toFixed(2)}`}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{listing.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {listing.description}
                  </CardDescription>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {listing.avgRating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {listing.downloadCount}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
