import Link from "next/link";
import { Plus, LayoutDashboard } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function DashboardListPage() {
  const session = await getSession();
  if (!session?.id) redirect("/login");

  const dashboards = await prisma.dashboard.findMany({
    where: { ownerId: session.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Dashboards</h1>
          <p className="text-muted-foreground text-sm">
            Create and manage your AI dashboards
          </p>
        </div>
        <Button render={<Link href="/dashboard/new" />}>
            <Plus className="h-4 w-4 mr-1" />
            New Dashboard
        </Button>
      </div>

      {dashboards.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-1">No dashboards yet</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first dashboard or install one from the marketplace.
          </p>
          <div className="flex gap-3">
            <Button render={<Link href="/dashboard/new" />}>Create Dashboard</Button>
            <Button variant="outline" render={<Link href="/marketplace" />}>Browse Marketplace</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dashboard) => {
            const widgetCount = Object.keys(
              JSON.parse(dashboard.config).widgets || {}
            ).length;
            return (
              <Link key={dashboard.id} href={`/dashboard/${dashboard.id}`}>
                <Card className="hover:border-primary/50 transition-colors h-full">
                  <div className="h-24 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center rounded-t-lg">
                    <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{dashboard.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {widgetCount} widget{widgetCount !== 1 ? "s" : ""} &middot;
                      Updated{" "}
                      {new Date(dashboard.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}

          {/* Add new card */}
          <Link href="/dashboard/new">
            <Card className="hover:border-primary/50 transition-colors h-full flex items-center justify-center min-h-[160px] border-dashed">
              <div className="text-center text-muted-foreground">
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <span className="text-sm">New Dashboard</span>
              </div>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
