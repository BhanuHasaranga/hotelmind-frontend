import { StatCard } from "@/components/ui/StatCard";
import { TopBar } from "@/components/layout/TopBar";
import { LiveOccupancyBadge } from "@/components/dashboard/LiveOccupancyBadge";
import { apiFetch } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types/dashboard";

async function getSummary(): Promise<DashboardSummary | null> {
  // Using a placeholder branch_id — in production this comes from the authenticated user's context
  const DEMO_BRANCH_ID = process.env.DEMO_BRANCH_ID;
  if (!DEMO_BRANCH_ID) return null;
  try {
    return await apiFetch<DashboardSummary>(`/api/v1/dashboard/summary?branch_id=${DEMO_BRANCH_ID}`);
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const summary = await getSummary();

  return (
    <>
      <TopBar title="Dashboard" subtitle="Hotel operational overview" />

      <div className="mt-6 space-y-6">
        {!summary && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Set <code>DEMO_BRANCH_ID</code> in <code>.env.local</code> to see live data, or use the API at{" "}
            <span className="font-mono">http://localhost:8000/docs</span>
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
                icon="🏨"
                accent="blue"
              />
              <LiveOccupancyBadge initialOccupancyPct={summary?.occupancy_pct ?? null} />
            </div>
            <StatCard
              label="Revenue Today"
              value={summary ? `$${Number(summary.revenue_today).toLocaleString()}` : "—"}
              sub={summary ? `MTD: $${Number(summary.revenue_mtd).toLocaleString()}` : "Connect API to view"}
              icon="💰"
              accent="green"
            />
            <StatCard
              label="Reservations Today"
              value={summary?.reservations_today ?? "—"}
              sub={summary ? `${summary.reservations_pending} pending` : "Connect API to view"}
              icon="📋"
              accent="purple"
            />
            <StatCard
              label="Restaurant Sales"
              value={summary ? `$${Number(summary.restaurant_sales_today).toLocaleString()}` : "—"}
              sub={summary ? `${summary.restaurant_orders_open} orders open` : "Connect API to view"}
              icon="🍽️"
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
            {[
              { href: "/hotels",     icon: "🏨", title: "Manage Hotels",     desc: "Hotels, branches, floors and rooms" },
              { href: "/bookings",   icon: "📋", title: "Reservations",      desc: "Check-in, check-out, cancellations" },
              { href: "/rooms",      icon: "🛏️", title: "Room Status",        desc: "Live room availability grid" },
              { href: "/restaurant", icon: "🍽️", title: "Restaurant",         desc: "Orders, tables and menu management" },
              { href: "/staff",      icon: "👥", title: "Staff Management",   desc: "Employees, schedules and attendance" },
            ].map(({ href, icon, title, desc }) => (
              <a
                key={href}
                href={href}
                className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="text-2xl">{icon}</span>
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
