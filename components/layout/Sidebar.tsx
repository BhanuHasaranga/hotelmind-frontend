"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard",  icon: "📊" },
  { href: "/hotels",     label: "Hotels",     icon: "🏨" },
  { href: "/rooms",      label: "Rooms",      icon: "🛏️" },
  { href: "/bookings",   label: "Bookings",   icon: "📋" },
  { href: "/restaurant", label: "Restaurant", icon: "🍽️" },
  { href: "/staff",      label: "Staff",      icon: "👥" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <span className="text-2xl">🏨</span>
        <div>
          <p className="text-sm font-bold text-white leading-tight">HotelMind</p>
          <p className="text-xs text-blue-300 leading-tight">AI Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
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
              <span className="text-base w-5 text-center">{icon}</span>
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
