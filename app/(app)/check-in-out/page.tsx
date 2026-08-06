import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { Alert } from "@/components/ui/Alert";
import { Sparkles } from "lucide-react";
import { getActiveBranch } from "@/lib/auth/branch";
import { getFrontDeskSummary } from "@/lib/adapters/front-desk";
import type { FrontDeskEntry } from "@/lib/adapters/front-desk";

const STAGE_VARIANT = {
  EXPECTED_ARRIVAL: "info",
  READY_FOR_CHECKIN: "success",
  IN_HOUSE: "neutral",
  EXPECTED_DEPARTURE: "warning",
  CHECKED_OUT: "neutral",
} as const;

const COLUMNS = [
  {
    key: "guestName",
    header: "Guest",
    render: (r: FrontDeskEntry) => (
      <span className="flex items-center gap-1.5">
        {r.guestName}
        {r.vip && <Badge label="VIP" variant="mock" />}
      </span>
    ),
  },
  { key: "roomNumber", header: "Room" },
  { key: "stage", header: "Stage", render: (r: FrontDeskEntry) => <Badge label={r.stage.replaceAll("_", " ")} variant={STAGE_VARIANT[r.stage]} /> },
  { key: "scheduledTime", header: "Scheduled" },
  { key: "partySize", header: "Party" },
  { key: "notes", header: "Notes", render: (r: FrontDeskEntry) => r.notes ?? "—" },
];

export default async function CheckInOutPage() {
  const active = await getActiveBranch();
  const summary = active?.branchId ? await getFrontDeskSummary(active.branchId) : null;

  return (
    <>
      <TopBar title="Check-in / Check-out" subtitle="Front-desk arrivals and departures board" dataSource="mock" />

      <div className="mt-6 space-y-6">
        <Alert variant="mock" icon={<Sparkles className="h-4 w-4" />} title="Preview module">
          hotelmind-backend has no dedicated front-desk workflow beyond the booking status enum — this screen is a
          fully-designed preview backed by simulated data (lib/adapters/front-desk).
        </Alert>

        {summary && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Arrivals Today" value={summary.arrivalsToday} icon="checkIn" accent="blue" />
              <StatCard label="In House" value={summary.inHouse} icon="hotel" accent="purple" />
              <StatCard label="Departures Today" value={summary.departuresToday} icon="checkOut" accent="amber" />
            </div>

            <DataTable<FrontDeskEntry>
              columns={COLUMNS as never}
              data={summary.entries}
              keyExtractor={(r) => r.id}
              emptyMessage="No arrivals or departures scheduled."
            />
          </>
        )}
      </div>
    </>
  );
}
