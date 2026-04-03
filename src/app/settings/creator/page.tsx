import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreatorSettings } from "./creator-settings";

export default async function CreatorPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
