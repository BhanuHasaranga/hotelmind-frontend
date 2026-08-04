"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard",  icon: "dashboard" as IconName, roles: null },
  { href: "/pricing",    label: "Pricing Intelligence", icon: "pricing" as IconName, roles: ["OWNER", "REVENUE_MANAGER"] },
  { href: "/assistant",  label: "AI Assistant", icon: "assistant" as IconName, roles: null },
  { href: "/guest-experience", label: "Guest Experience", icon: "guestExperience" as IconName, roles: ["OWNER", "GUEST_EXPERIENCE_MANAGER"] },
  { href: "/staffing",   label: "Staffing", icon: "staffing" as IconName, roles: ["OWNER", "OPS_MANAGER"] },
  { href: "/hotels",     label: "Hotels",     icon: "hotel" as IconName, roles: null },
  { href: "/rooms",      label: "Rooms",      icon: "bed" as IconName, roles: null },
  { href: "/bookings",   label: "Bookings",   icon: "bookings" as IconName, roles: null },
  { href: "/restaurant", label: "Restaurant", icon: "restaurant" as IconName, roles: null },
  { href: "/restaurant-demand", label: "Demand Forecast", icon: "demandForecast" as IconName, roles: ["OWNER", "RESTAURANT_MANAGER"] },
  { href: "/staff",      label: "Staff",      icon: "staff" as IconName, roles: null },
] as const;

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.roles || (role && (item.roles as readonly string[]).includes(role)));

  return (
    <aside className="flex h-screen w-60 flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <Icon name="brand" size={24} className="text-white" />
        <div>
          <p className="text-sm font-bold text-white leading-tight">HotelMind</p>
          <p className="text-xs text-blue-300 leading-tight">AI Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--sidebar-active)] text-white"
                  : "text-[var(--sidebar-text)] hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <span className="flex w-5 items-center justify-center">
                <Icon name={icon} size={18} />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-blue-300 opacity-70">v1.0.0 · Phase 2</p>
      </div>
    </aside>
  );
}
