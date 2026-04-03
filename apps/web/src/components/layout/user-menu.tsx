"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, User as UserIcon, Key } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface UserMenuProps {
  user: {
    id: string;
    name: string | null;
    provider: string;
    keyPrefix: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const providerLabel = user.provider === "anthropic" ? "Claude" : "OpenAI";
  const providerColor =
    user.provider === "anthropic" ? "bg-orange-500" : "bg-green-500";

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              <Key className="h-3.5 w-3.5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`w-2 h-2 rounded-full ${providerColor}`} />
            <p className="text-sm font-medium">{providerLabel}</p>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {user.keyPrefix}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <UserIcon className="mr-2 h-4 w-4" />
          My Dashboards
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
