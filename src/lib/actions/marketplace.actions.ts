"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function installListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
    include: { dashboard: true },
  });

  if (!listing) throw new Error("Listing not found");

  // Record the purchase/install
  await prisma.purchase.create({
    data: {
      price: listing.price,
      userId: session.user.id,
      listingId: listing.id,
    },
  });

  // Increment download count
  await prisma.marketplaceListing.update({
    where: { id: listingId },
    data: { downloadCount: { increment: 1 } },
  });

  // If it's a dashboard listing, clone the dashboard config
  if (listing.type === "dashboard" && listing.dashboard) {
    const dashboard = await prisma.dashboard.create({
      data: {
        name: listing.title,
        description: listing.description,
        config: listing.dashboard.config,
        theme: listing.dashboard.theme,
        ownerId: session.user.id,
        sourceListingId: listing.id,
      },
    });

    revalidatePath("/dashboard");
    redirect(`/dashboard/${dashboard.id}`);
  }

  revalidatePath("/marketplace");
  redirect("/dashboard");
}
