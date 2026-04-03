import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardSettings } from "./dashboard-settings";

export default async function DashboardSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.id) redirect("/login");

  const dashboard = await prisma.dashboard.findUnique({
    where: { id },
  });

  if (!dashboard || dashboard.ownerId !== session.id) {
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
