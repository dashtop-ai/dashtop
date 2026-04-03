import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Marketplace — Dashtop",
  description: "Browse and install AI dashboard templates, widgets, and configs from the community.",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
