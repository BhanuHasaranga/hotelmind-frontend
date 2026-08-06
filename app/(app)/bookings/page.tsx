import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { apiFetchAuthed } from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import type { Reservation } from "@/lib/types/booking";

async function getReservations(token: string): Promise<Reservation[]> {
  try {
    return await apiFetchAuthed<Reservation[]>("/api/v1/bookings/reservations", token);
  } catch {
    return [];
  }
}

type ResRow = Reservation;

const COLUMNS = [
  {
    key: "guest",
    header: "Guest",
    render: (r: ResRow) =>
      r.guest ? `${r.guest.first_name} ${r.guest.last_name}` : r.guest_id.slice(0, 8) + "…",
  },
  { key: "check_in_date",  header: "Check-in" },
  { key: "check_out_date", header: "Check-out" },
  {
    key: "status",
    header: "Status",
    render: (r: ResRow) => <Badge label={r.status} />,
  },
  {
    key: "total_amount",
    header: "Amount",
    render: (r: ResRow) => `$${Number(r.total_amount).toLocaleString()}`,
  },
  { key: "adults", header: "Guests" },
];

export default async function BookingsPage() {
  const session = await getSession();
  const reservations = session ? await getReservations(session.token) : [];

  const counts = {
    total:      reservations.length,
    pending:    reservations.filter((r) => r.status === "PENDING").length,
    confirmed:  reservations.filter((r) => r.status === "CONFIRMED").length,
    checkedIn:  reservations.filter((r) => r.status === "CHECKED_IN").length,
  };

  return (
    <>
      <TopBar title="Bookings" subtitle="Reservations management" dataSource="real" />

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total",      value: counts.total,     color: "text-blue-600" },
            { label: "Pending",    value: counts.pending,   color: "text-amber-600" },
            { label: "Confirmed",  value: counts.confirmed, color: "text-green-600" },
            { label: "Checked In", value: counts.checkedIn, color: "text-purple-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <DataTable<ResRow>
          columns={COLUMNS as never}
          data={reservations}
          keyExtractor={(r) => r.id}
          emptyMessage="No reservations yet. Create one via POST /api/v1/bookings/reservations"
        />
      </div>
    </>
  );
}
