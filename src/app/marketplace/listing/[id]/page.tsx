import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Download, User } from "lucide-react";
import { installListing } from "@/lib/actions/marketplace.actions";
import { ReviewForm } from "@/components/marketplace/review-form";
import Link from "next/link";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id, isPublished: true },
    include: {
      creator: { select: { name: true, username: true, image: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!listing) notFound();

  const tags: string[] = JSON.parse(listing.tags || "[]");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{listing.type}</Badge>
            <Badge variant="secondary">{listing.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <p className="text-muted-foreground mb-4">{listing.description}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              {listing.avgRating.toFixed(1)} ({listing.reviewCount} reviews)
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {listing.downloadCount} installs
            </span>
            {listing.creator?.username ? (
              <Link
                href={`/marketplace/creator/${listing.creator.username}`}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                {listing.creator.name || listing.creator.username}
              </Link>
            ) : (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Unknown
              </span>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Card className="w-full md:w-64 shrink-0">
          <CardContent className="p-4 space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {listing.price === 0 ? "Free" : `$${listing.price.toFixed(2)}`}
              </div>
              {listing.pricingModel === "tip-jar" && (
                <p className="text-xs text-muted-foreground">Tip jar</p>
              )}
            </div>
            {session?.user ? (
              <form action={installListing.bind(null, listing.id)}>
                <Button className="w-full" type="submit">
                  {listing.price === 0 ? "Install" : "Buy & Install"}
                </Button>
              </form>
            ) : (
              <Button className="w-full" render={<a href="/login" />}>Sign in to install</Button>
            )}
            <p className="text-xs text-muted-foreground text-center">
              v{listing.version}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {listing.longDescription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {listing.longDescription}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Reviews ({listing.reviewCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {listing.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {listing.reviews.map((review) => (
                <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {review.user?.name || "Anonymous"}
                    </span>
                    <span className="flex items-center text-xs text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </span>
                  </div>
                  {review.title && (
                    <p className="text-sm font-medium">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {session?.user && (
            <ReviewForm listingId={listing.id} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
