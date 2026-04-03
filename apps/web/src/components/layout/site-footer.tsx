import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashtop</span>
          <span>&middot;</span>
          <span>AI Dashboard Marketplace</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/marketplace" className="hover:text-foreground transition-colors">
            Marketplace
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
