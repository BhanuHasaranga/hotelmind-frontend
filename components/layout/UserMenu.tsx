"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-black/5 dark:hover:bg-white/5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sidebar-active)] text-sm font-bold text-white">
          {initials}
        </div>
        <Icon name="chevronDown" size={14} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-2 shadow-lg">
          <div className="px-2 py-2">
            <p className="text-sm font-semibold text-[var(--foreground)]">{fullName ?? "Unknown user"}</p>
            <p className="text-xs text-gray-500">{role ? (ROLE_LABELS[role] ?? role) : ""}</p>
          </div>
          <div className="my-1 h-px bg-[var(--border)]" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-[var(--color-danger-fg)] hover:bg-[var(--color-danger-bg)]"
          >
            <Icon name="close" size={14} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
