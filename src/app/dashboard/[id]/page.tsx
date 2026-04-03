import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type DashboardConfig } from "@/widgets/types";
import { DashboardView } from "./dashboard-view";

export default async function DashboardPage({
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
