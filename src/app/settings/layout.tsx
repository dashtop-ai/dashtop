import { SiteHeader } from "@/components/layout/site-header";
import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="container max-w-4xl py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="flex gap-8">
          <nav className="w-48 shrink-0 space-y-1">
            <Link
              href="/settings/profile"
              className="block text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/settings/creator"
              className="block text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
              Creator
            </Link>
            <Link
              href="/settings/packages"
              className="block text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors"
            >
              Packages
            </Link>
          </nav>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
