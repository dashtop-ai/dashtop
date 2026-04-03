import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CreatorSettings } from "./creator-settings";

export default async function CreatorPage() {
  const session = await getSession();
  if (!session?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      isCreator: true,
      username: true,
      marketplaceListings: {
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          type: true,
          downloadCount: true,
          avgRating: true,
          price: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <CreatorSettings
      isCreator={user.isCreator}
      username={user.username}
      listings={user.marketplaceListings}
    />
  );
}
