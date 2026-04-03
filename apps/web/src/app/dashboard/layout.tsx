import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "My Dashboards — Dashtop",
  description: "Create and manage your personalized AI dashboards.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
