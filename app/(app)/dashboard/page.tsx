import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TopBar } from "@/components/layout/TopBar";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LiveOccupancyBadge } from "@/components/dashboard/LiveOccupancyBadge";
import { DataSourceBadge } from "@/components/shared/data-source-badge";
import { apiFetchAuthed } from "@/lib/api";
import { getActiveBranch } from "@/lib/auth/branch";
import { getDashboardExtras } from "@/lib/adapters/dashboard-extras";
import type { DashboardSummary } from "@/lib/types/dashboard";
import type { DashboardExtras } from "@/lib/adapters/dashboard-extras";
import { AlertTriangle, Cloud, PartyPopper, Gauge, Trash2, Wrench, Sparkles } from "lucide-react";

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

async function getExtras(branchId: string): Promise<DashboardExtras | null> {
  try {
    return await getDashboardExtras(branchId);
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const active = await getActiveBranch();
  const summary = active?.branchId ? await getSummary(active.session.token, active.branchId) : null;
  const extras = active?.branchId ? await getExtras(active.branchId) : null;

  return (
    <>
      <TopBar title="Executive Dashboard" subtitle="Live operational overview across your property" dataSource="real" />

      <div className="mt-6 space-y-8">
        {!summary && (
          <div className="rounded-xl border border-[var(--color-warning-fg)]/30 bg-[var(--color-warning-bg)] px-5 py-4 text-sm text-[var(--color-warning-fg)]">
            {active?.branchId
              ? "Could not load dashboard data for the selected branch."
              : "Select a branch from the switcher above to see live data."}
          </div>
        )}

        {/* Key Metrics — real data */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Key Metrics</h2>
            <DataSourceBadge source="real" compact />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <StatCard
                label="Occupancy"
                value={summary ? `${summary.occupancy_pct.toFixed(1)}%` : "—"}
                sub={summary ? `${summary.occupied_rooms} / ${summary.total_rooms} rooms` : "Connect API to view"}
                icon="hotel"
                accent="brand"
              />
              <LiveOccupancyBadge initialOccupancyPct={summary?.occupancy_pct ?? null} token={active?.session.token} />
            </div>
            <StatCard
              label="Revenue Today"
              value={summary ? `$${Number(summary.revenue_today).toLocaleString()}` : "—"}
              sub={summary ? `MTD: $${Number(summary.revenue_mtd).toLocaleString()}` : "Connect API to view"}
              icon="revenue"
              accent="premium"
            />
            <StatCard
              label="Reservations Today"
              value={summary?.reservations_today ?? "—"}
              sub={summary ? `${summary.reservations_pending} pending` : "Connect API to view"}
              icon="reservations"
              accent="brand"
            />
            <StatCard
              label="Restaurant Sales"
              value={summary ? `$${Number(summary.restaurant_sales_today).toLocaleString()}` : "—"}
              sub={summary ? `${summary.restaurant_orders_open} orders open` : "Connect API to view"}
              icon="restaurantSales"
              accent="success"
            />
          </div>
        </section>

        {/* Preview / Simulated Insights — mock data, visually distinct */}
        {extras && (
          <section className="rounded-2xl border border-dashed border-mock-foreground/30 bg-mock/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-mock-foreground">
                  Preview &middot; Simulated Insights
                </h2>
                <DataSourceBadge source="mock" compact />
              </div>
              <p className="text-xs text-muted-foreground">
                Not yet backed by a live integration — shown for demonstration only
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="border-mock-foreground/20 bg-card/60">
                <CardContent className="flex items-start justify-between p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Weather</p>
                    <p className="mt-1 text-xl font-bold text-foreground">{extras.weather.tempC}°C</p>
                    <p className="mt-0.5 text-xs capitalize text-muted-foreground">{extras.weather.condition}</p>
                  </div>
                  <Cloud className="h-5 w-5 text-mock-foreground" />
                </CardContent>
              </Card>

              <Card className="border-mock-foreground/20 bg-card/60">
                <CardContent className="flex items-start justify-between p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Local Events</p>
                    <p className="mt-1 text-xl font-bold text-foreground">{extras.events.length}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {extras.events[0]?.name ?? "None nearby"}
                    </p>
                  </div>
                  <PartyPopper className="h-5 w-5 text-mock-foreground" />
                </CardContent>
              </Card>

              <Card className="border-mock-foreground/20 bg-card/60">
                <CardContent className="flex items-start justify-between p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Staff Utilization</p>
                    <p className="mt-1 text-xl font-bold text-foreground">{extras.staffUtilization.utilizationPct}%</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {extras.staffUtilization.scheduledStaff}/{extras.staffUtilization.requiredStaff} scheduled
                    </p>
                  </div>
                  <Gauge className="h-5 w-5 text-mock-foreground" />
                </CardContent>
              </Card>

              <Card className="border-mock-foreground/20 bg-card/60">
                <CardContent className="flex items-start justify-between p-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Food Waste</p>
                    <p className="mt-1 text-xl font-bold text-foreground">{extras.foodWaste.wastePct}%</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">${extras.foodWaste.wasteCostToday} today</p>
                  </div>
                  <Trash2 className="h-5 w-5 text-mock-foreground" />
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card className="border-mock-foreground/20 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-mock-foreground" /> Maintenance Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-2xl font-bold text-foreground">{extras.maintenanceAlerts.openTickets}</p>
                  <p className="text-xs text-muted-foreground">
                    {extras.maintenanceAlerts.urgentTickets} marked urgent
                  </p>
                </CardContent>
              </Card>

              <Card className="border-mock-foreground/20 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-mock-foreground" /> AI Insights &amp; Risk
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-2">
                  {extras.aiInsights.map((insight) => (
                    <div key={insight.id} className="flex items-start gap-2 text-xs">
                      <AlertTriangle
                        className={
                          "mt-0.5 h-3.5 w-3.5 shrink-0 " +
                          (insight.severity === "critical"
                            ? "text-[var(--color-danger-fg)]"
                            : insight.severity === "warning"
                              ? "text-[var(--color-warning-fg)]"
                              : "text-muted-foreground")
                        }
                      />
                      <span className="text-foreground">{insight.message}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Quick Links */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Access</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map(({ href, icon, title, desc }) => (
              <a
                key={href}
                href={href}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon name={icon} size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
