import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MARKETPLACE_CATEGORIES } from "@/config/categories";
import { Star, Download } from "lucide-react";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const query = params.q;
  const sort = params.sort || "popular";

  const where = {
    isPublished: true,
    ...(category && { category }),
    ...(query && {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    }),
  };

  const orderBy =
    sort === "newest"
      ? { createdAt: "desc" as const }
      : sort === "top-rated"
        ? { avgRating: "desc" as const }
        : { downloadCount: "desc" as const };

  const listings = await prisma.marketplaceListing.findMany({
    where,
    orderBy,
    take: 50,
    include: {
      creator: { select: { name: true, username: true, image: true } },
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">
          Browse dashboard templates, widgets, and configs from the community.
        </p>
        <form className="max-w-md">
          <Input
            name="q"
            placeholder="Search dashboards, widgets..."
            defaultValue={query}
          />
        </form>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link href="/marketplace">
          <Badge variant={!category ? "default" : "outline"}>All</Badge>
        </Link>
        {MARKETPLACE_CATEGORIES.map((cat) => (
          <Link key={cat.slug} href={`/marketplace?category=${cat.slug}`}>
            <Badge variant={category === cat.slug ? "default" : "outline"}>
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Listings grid */}
      {listings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No listings found</p>
          <p className="text-sm mt-1">
            {query
              ? "Try a different search term"
              : "Be the first to publish something!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/marketplace/listing/${listing.id}`}
            >
              <Card className="hover:border-primary/50 transition-colors h-full">
                <div className="h-28 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg" />
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
                    {listing.creator?.name && (
                      <span>by {listing.creator.name}</span>
                    )}
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
