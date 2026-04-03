"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Globe, Menu, X, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

interface SessionUser {
  id: string;
  name: string | null;
  provider: string;
  keyPrefix: string;
}

export function SiteHeader() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
          <LayoutDashboard className="h-5 w-5" />
          <span className="hidden sm:inline">Dashtop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm flex-1">
          <Link
            href="/marketplace"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="h-4 w-4" />
            Explore Apps
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              My Dashboards
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button size="sm" render={<Link href="/login" />}>
              Sign In
            </Button>
          )}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-2">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-sm py-2 hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <Globe className="h-4 w-4" />
            Explore Apps
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm py-2 hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              My Dashboards
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
