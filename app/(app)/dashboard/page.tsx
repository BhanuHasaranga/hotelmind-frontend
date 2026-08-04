import { StatCard } from "@/components/ui/StatCard";
import { TopBar } from "@/components/layout/TopBar";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LiveOccupancyBadge } from "@/components/dashboard/LiveOccupancyBadge";
import { apiFetchAuthed } from "@/lib/api";
import { getActiveBranch } from "@/lib/auth/branch";
import type { DashboardSummary } from "@/lib/types/dashboard";

const QUICK_LINKS: { href: string; icon: IconName; title: string; desc: string }[] = [
  { href: "/hotels", icon: "hotel", title: "Manage Hotels", desc: "Hotels, branches, floors and rooms" },
  { href: "/bookings", icon: "bookings", title: "Reservations", desc: "Check-in, check-out, cancellations" },
  { href: "/rooms", icon: "bed", title: "Room Status", desc: "Live room availability grid" },
  { href: "/restaurant", icon: "restaurant", title: "Restaurant", desc: "Orders, tables and menu management" },
  { href: "/staff", icon: "staff", title: "Staff Management", desc: "Employees, schedules and attendance" },
];

async function getSummary(token: string, branchId: string): Promise<DashboardSummary | null> {
  try {
    return await apiFetchAuthed<DashboardSummary>(`/api/v1/dashboard/summary?branch_id=${branchId}`, token);
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const active = await getActiveBranch();
  const summary =
    active?.branchId ? await getSummary(active.session.token, active.branchId) : null;

  return (
    <>
      <TopBar title="Dashboard" subtitle="Hotel operational overview" />

      <div className="mt-6 space-y-6">
        {!summary && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {active?.branchId
              ? "Could not load dashboard data for the selected branch."
              : "Select a branch from the switcher above to see live data."}
          </div>
        )}

        {/* KPI Cards */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <StatCard
                label="Occupancy"
                value={summary ? `${summary.occupancy_pct.toFixed(1)}%` : "—"}
                sub={summary ? `${summary.occupied_rooms} / ${summary.total_rooms} rooms` : "Connect API to view"}
                icon="hotel"
                accent="blue"
              />
              <LiveOccupancyBadge
                initialOccupancyPct={summary?.occupancy_pct ?? null}
                token={active?.session.token}
              />
            </div>
            <StatCard
              label="Revenue Today"
              value={summary ? `$${Number(summary.revenue_today).toLocaleString()}` : "—"}
              sub={summary ? `MTD: $${Number(summary.revenue_mtd).toLocaleString()}` : "Connect API to view"}
              icon="revenue"
              accent="green"
            />
            <StatCard
              label="Reservations Today"
              value={summary?.reservations_today ?? "—"}
              sub={summary ? `${summary.reservations_pending} pending` : "Connect API to view"}
              icon="reservations"
              accent="purple"
            />
            <StatCard
              label="Restaurant Sales"
              value={summary ? `$${Number(summary.restaurant_sales_today).toLocaleString()}` : "—"}
              sub={summary ? `${summary.restaurant_orders_open} orders open` : "Connect API to view"}
              icon="restaurantSales"
              accent="amber"
            />
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map(({ href, icon, title, desc }) => (
              <a
                key={href}
                href={href}
                className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Icon name={icon} size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
