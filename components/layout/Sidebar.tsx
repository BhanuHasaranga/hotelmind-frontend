"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { CAPABILITIES, type Capability } from "@/lib/adapters/config";
import { cn } from "@/lib/utils";

interface NavLeaf {
  href: string;
  label: string;
  icon: IconName;
  roles: readonly string[] | null;
  capability?: Capability;
}

interface NavGroup {
  id: string;
  label: string;
  icon: IconName;
  roles: readonly string[] | null;
  items: readonly NavLeaf[];
}

type NavEntry = NavLeaf | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

const NAV: readonly NavEntry[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", roles: null },
  {
    id: "operations",
    label: "Operations",
    icon: "bookings",
    roles: null,
    items: [
      { href: "/bookings", label: "Reservations", icon: "bookings", roles: null },
      { href: "/check-in-out", label: "Check-in / Check-out", icon: "checkIn", roles: ["OWNER", "OPS_MANAGER"], capability: "frontDesk" },
      { href: "/rooms", label: "Rooms", icon: "bed", roles: null },
      { href: "/housekeeping", label: "Housekeeping", icon: "housekeeping", roles: ["OWNER", "OPS_MANAGER"], capability: "housekeeping" },
      { href: "/maintenance", label: "Maintenance", icon: "maintenance", roles: ["OWNER", "OPS_MANAGER"], capability: "maintenance" },
    ],
  },
  {
    id: "guests",
    label: "Guests",
    icon: "guests",
    roles: ["OWNER", "GUEST_EXPERIENCE_MANAGER"],
    items: [
      { href: "/guest-experience", label: "Guest Experience", icon: "guestExperience", roles: ["OWNER", "GUEST_EXPERIENCE_MANAGER"] },
      { href: "/loyalty", label: "Guest Directory & Loyalty", icon: "loyalty", roles: ["OWNER", "GUEST_EXPERIENCE_MANAGER"], capability: "loyalty" },
    ],
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: "pricing",
    roles: ["OWNER", "REVENUE_MANAGER"],
    items: [
      { href: "/pricing", label: "Pricing Intelligence", icon: "pricing", roles: ["OWNER", "REVENUE_MANAGER"] },
      { href: "/reports", label: "Reports", icon: "reports", roles: ["OWNER", "REVENUE_MANAGER"] },
    ],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    icon: "restaurant",
    roles: ["OWNER", "RESTAURANT_MANAGER"],
    items: [
      { href: "/restaurant", label: "Restaurant", icon: "restaurant", roles: ["OWNER", "RESTAURANT_MANAGER"] },
      { href: "/restaurant-demand", label: "Demand Forecast", icon: "demandForecast", roles: ["OWNER", "RESTAURANT_MANAGER"] },
    ],
  },
  {
    id: "employees",
    label: "Employees",
    icon: "staff",
    roles: ["OWNER", "OPS_MANAGER"],
    items: [
      { href: "/staff", label: "Staff", icon: "staff", roles: null },
      { href: "/staffing", label: "Staffing Forecast", icon: "staffing", roles: ["OWNER", "OPS_MANAGER"] },
      { href: "/hr", label: "HR & Payroll", icon: "guests", roles: ["OWNER"], capability: "hrPayroll" },
    ],
  },
  {
    id: "hotels",
    label: "Hotels (Portfolio)",
    icon: "hotel",
    roles: null,
    items: [
      { href: "/hotels", label: "Hotels & Branches", icon: "hotel", roles: null },
      { href: "/portfolio", label: "Multi-Property Rollup", icon: "portfolio", roles: ["OWNER"], capability: "portfolioRollup" },
    ],
  },
  { href: "/assistant", label: "AI Assistant", icon: "ai", roles: null },
  { href: "/admin", label: "Administration", icon: "admin", roles: ["OWNER"] },
] as const;

interface SidebarProps {
  role?: string;
}

function visibleForRole(roles: readonly string[] | null, role?: string) {
  return !roles || (role != null && roles.includes(role));
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const entries = NAV.filter((entry) => visibleForRole(entry.roles, role));

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
        <Logo size={24} className="text-primary" />
        <div>
          <p className="text-sm font-bold leading-tight text-foreground">HotelMind</p>
          <p className="text-xs leading-tight text-muted-foreground">AI Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {entries.map((entry) => {
          if (!isGroup(entry)) {
            const isActive = pathname === entry.href || pathname.startsWith(`${entry.href}/`);
            return <NavLink key={entry.href} entry={entry} isActive={isActive} />;
          }

          const items = entry.items.filter((item) => visibleForRole(item.roles, role));
          if (items.length === 0) return null;

          const isOpen = collapsed[entry.id] !== false; // default open
          const groupActive = items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

          return (
            <div key={entry.id}>
              <button
                type="button"
                onClick={() => setCollapsed((c) => ({ ...c, [entry.id]: !isOpen }))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                  "text-muted-foreground hover:text-foreground",
                  groupActive && "text-foreground",
                )}
              >
                <span className="flex w-5 items-center justify-center">
                  <Icon name={entry.icon} size={16} />
                </span>
                <span className="flex-1 text-left">{entry.label}</span>
                <ChevronRight
                  size={14}
                  className={cn("transition-transform", isOpen && "rotate-90")}
                />
              </button>
              {isOpen && (
                <div className="mb-1 ml-3 space-y-0.5 border-l border-sidebar-border pl-3">
                  {items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return <NavLink key={item.href} entry={item} isActive={isActive} compact />;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-6 py-4">
        <p className="text-xs text-muted-foreground">v2.0.0 · Enterprise</p>
      </div>
    </aside>
  );
}

function NavLink({ entry, isActive, compact = false }: { entry: NavLeaf; isActive: boolean; compact?: boolean }) {
  const mocked = entry.capability && CAPABILITIES[entry.capability] === "mock";
  return (
    <Link
      href={entry.href}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        compact && "py-2 text-[13px]",
        isActive
          ? // Soft green fill + dark green text, plus a brand-green left bar as
            // a second, non-color-dependent cue that this item is selected.
            "bg-sidebar-primary font-semibold text-sidebar-primary-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-primary before:content-['']"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <span className="flex w-5 items-center justify-center">
        <Icon name={entry.icon} size={compact ? 16 : 18} />
      </span>
      <span className="flex-1">{entry.label}</span>
      {mocked && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-mock-foreground"
          title="Preview feature — simulated data, not yet backed by a live integration"
        />
      )}
    </Link>
  );
}
