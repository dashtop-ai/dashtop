import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { type DashboardConfig } from "@/widgets/types";
import { DashboardView } from "./dashboard-view";

export default async function DashboardPage({
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

  const config = JSON.parse(dashboard.config) as DashboardConfig;

  return (
    <DashboardView
      dashboardId={dashboard.id}
      dashboardName={dashboard.name}
      initialConfig={config}
      isEditing={false}
    />
  );
}
