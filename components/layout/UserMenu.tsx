"use client";

import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  REVENUE_MANAGER: "Revenue Manager",
  OPS_MANAGER: "Ops Manager",
  RESTAURANT_MANAGER: "Restaurant Manager",
  GUEST_EXPERIENCE_MANAGER: "Guest Experience Manager",
};

interface UserMenuProps {
  fullName?: string;
  role?: string;
}

export function UserMenu({ fullName, role }: UserMenuProps) {
  const router = useRouter();

  const initials = fullName
    ? fullName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {initials}
        </div>
        <ChevronDown size={14} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>
          <p className="text-sm font-semibold text-foreground">{fullName ?? "Unknown user"}</p>
          <p className="text-xs font-normal text-muted-foreground">{role ? (ROLE_LABELS[role] ?? role) : ""}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <LogOut size={14} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
