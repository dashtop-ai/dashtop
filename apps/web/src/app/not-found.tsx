import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <LayoutDashboard className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="text-muted-foreground text-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="flex gap-3">
        <Button render={<Link href="/" />}>Go Home</Button>
        <Button variant="outline" render={<Link href="/marketplace" />}>
          Browse Marketplace
        </Button>
      </div>
    </div>
  );
}
