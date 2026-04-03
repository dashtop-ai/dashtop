"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReview(
  listingId: string,
  data: { rating: number; title: string; comment: string }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check if user already reviewed
  const existing = await prisma.review.findUnique({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
  });
  if (existing) throw new Error("You already reviewed this listing");

  // Create review
  await prisma.review.create({
    data: {
      rating: data.rating,
      title: data.title || null,
      comment: data.comment || null,
      userId: session.user.id,
      listingId,
    },
  });

  // Update listing avg rating
  const reviews = await prisma.review.findMany({
    where: { listingId },
    select: { rating: true },
  });
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.marketplaceListing.update({
    where: { id: listingId },
    data: {
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    },
  });

  revalidatePath(`/marketplace/listing/${listingId}`);
}
