import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardSettings } from "./dashboard-settings";

export default async function DashboardSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const dashboard = await prisma.dashboard.findUnique({
    where: { id },
  });

  if (!dashboard || dashboard.ownerId !== session.user.id) {
    notFound();
  }

  return (
    <DashboardSettings
      dashboard={{
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description || "",
        theme: dashboard.theme,
        visibility: dashboard.visibility as "private" | "public" | "unlisted",
        config: dashboard.config,
      }}
    />
  );
}
