"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function publishToMarketplace(
  dashboardId: string,
  data: {
    title: string;
    description: string;
    longDescription: string;
    category: string;
    tags: string[];
    price: number;
    pricingModel: string;
  }
) {
  const session = await getSession();
  if (!session?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { isCreator: true },
  });
  if (!user?.isCreator) throw new Error("You must be a creator to publish");

  const dashboard = await prisma.dashboard.findUnique({
    where: { id: dashboardId },
  });
  if (!dashboard || dashboard.ownerId !== session.id) {
    throw new Error("Dashboard not found");
  }

  // Check if already published
  const existing = await prisma.marketplaceListing.findUnique({
    where: { dashboardId },
  });
  if (existing) throw new Error("This dashboard is already published");

  // Make dashboard a public template
  await prisma.dashboard.update({
    where: { id: dashboardId },
    data: { isTemplate: true, visibility: "public" },
  });

  // Create listing
  await prisma.marketplaceListing.create({
    data: {
      title: data.title,
      description: data.description,
      longDescription: data.longDescription || null,
      type: "dashboard",
      category: data.category,
      tags: JSON.stringify(data.tags),
      price: data.price,
      pricingModel: data.pricingModel,
      creatorId: session.id,
      dashboardId,
    },
  });

  revalidatePath(`/dashboard/${dashboardId}/settings`);
  revalidatePath("/marketplace");
}
