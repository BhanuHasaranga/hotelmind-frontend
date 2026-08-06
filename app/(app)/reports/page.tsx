import { TopBar } from "@/components/layout/TopBar";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiFetchAuthed } from "@/lib/api";
import { getActiveBranch } from "@/lib/auth/branch";
import type { DashboardSummary } from "@/lib/types/dashboard";
import type { Reservation, ReservationStatus } from "@/lib/types/booking";

async function getSummary(token: string, branchId: string): Promise<DashboardSummary | null> {
  try {
    return await apiFetchAuthed<DashboardSummary>(`/api/v1/dashboard/summary?branch_id=${branchId}`, token);
  } catch {
    return null;
  }
}

async function getReservations(token: string): Promise<Reservation[]> {
  try {
    return await apiFetchAuthed<Reservation[]>("/api/v1/bookings/reservations", token);
  } catch {
    return [];
  }
}

const STATUS_ORDER: ReservationStatus[] = ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED", "NO_SHOW"];

export default async function ReportsPage() {
  const active = await getActiveBranch();
  const [summary, reservations] = active?.branchId
    ? await Promise.all([getSummary(active.session.token, active.branchId), getReservations(active.session.token)])
    : [null, []];

  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: reservations.filter((r) => r.status === status).length,
  }));

  const revenueCollected = reservations.reduce((sum, r) => sum + Number(r.paid_amount || 0), 0);
  const revenueBooked = reservations.reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
  const collectionRate = revenueBooked > 0 ? ((revenueCollected / revenueBooked) * 100).toFixed(1) : "—";

  return (
    <>
      <TopBar title="Reports" subtitle="Operational KPIs assembled from live reservation and revenue data" dataSource="real" />

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Occupancy" value={summary ? `${summary.occupancy_pct.toFixed(1)}%` : "—"} icon="hotel" accent="blue" />
          <StatCard label="Revenue MTD" value={summary ? `$${Number(summary.revenue_mtd).toLocaleString()}` : "—"} icon="revenue" accent="green" />
          <StatCard label="Total Reservations" value={reservations.length} icon="bookings" accent="purple" />
          <StatCard label="Collection Rate" value={typeof collectionRate === "string" ? collectionRate : `${collectionRate}%`} sub="Paid vs. booked amount" icon="reports" accent="amber" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reservations by Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {statusCounts.map(({ status, count }) => (
                <div key={status} className="rounded-lg border border-border p-3 text-center">
                  <Badge label={status} />
                  <p className="mt-2 text-xl font-bold text-foreground">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Booked (total_amount)</p>
              <p className="text-xl font-bold text-foreground">${revenueBooked.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Collected (paid_amount)</p>
              <p className="text-xl font-bold text-foreground">${revenueCollected.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="text-xl font-bold text-foreground">${(revenueBooked - revenueCollected).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
