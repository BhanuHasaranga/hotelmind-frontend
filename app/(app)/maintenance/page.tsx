import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Alert } from "@/components/ui/Alert";
import { Sparkles } from "lucide-react";
import { getActiveBranch } from "@/lib/auth/branch";
import { getMaintenanceSummary } from "@/lib/adapters/maintenance";
import type { MaintenanceTicket } from "@/lib/adapters/maintenance";

const PRIORITY_VARIANT = {
  LOW: "neutral",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "danger",
} as const;

const COLUMNS = [
  { key: "ticketNumber", header: "Ticket" },
  { key: "location", header: "Location" },
  { key: "category", header: "Category" },
  { key: "status", header: "Status", render: (r: MaintenanceTicket) => <Badge label={r.status} /> },
  { key: "priority", header: "Priority", render: (r: MaintenanceTicket) => <Badge label={r.priority} variant={PRIORITY_VARIANT[r.priority]} /> },
  { key: "assignedTo", header: "Assigned To", render: (r: MaintenanceTicket) => r.assignedTo ?? "Unassigned" },
  { key: "slaHours", header: "SLA", render: (r: MaintenanceTicket) => `${r.slaHours}h` },
];

export default async function MaintenancePage() {
  const active = await getActiveBranch();
  const summary = active?.branchId ? await getMaintenanceSummary(active.branchId) : null;

  return (
    <>
      <TopBar title="Maintenance" subtitle="Work orders and asset tickets" dataSource="mock" />

      <div className="mt-6 space-y-6">
        <Alert variant="mock" icon={<Sparkles className="h-4 w-4" />} title="Preview module">
          hotelmind-backend has no maintenance ticketing module yet — this screen is a fully-designed preview backed
          by simulated data (lib/adapters/maintenance) so the workflow can be demonstrated before a real integration
          exists.
        </Alert>

        {summary && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
              {(["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED"] as const).map((status) => (
                <div key={status} className="rounded-xl border border-border bg-card p-4 text-center shadow-xs">
                  <Badge label={status} />
                  <p className="mt-2 text-2xl font-bold text-foreground">{summary.counts[status]}</p>
                </div>
              ))}
              <div className="rounded-xl border border-border bg-card p-4 text-center shadow-xs">
                <p className="text-xs text-muted-foreground">Avg. Resolution</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{summary.avgResolutionHours}h</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center shadow-xs">
                <p className="text-xs text-muted-foreground">SLA Breaches</p>
                <p className="mt-2 text-2xl font-bold text-[var(--color-danger-fg)]">{summary.slaBreaches}</p>
              </div>
            </div>

            <DataTable<MaintenanceTicket>
              columns={COLUMNS as never}
              data={summary.tickets}
              keyExtractor={(r) => r.id}
              emptyMessage="No maintenance tickets."
            />
          </>
        )}
      </div>
    </>
  );
}
