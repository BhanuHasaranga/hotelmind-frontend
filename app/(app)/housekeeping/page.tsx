import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Alert } from "@/components/ui/Alert";
import { Sparkles } from "lucide-react";
import { getActiveBranch } from "@/lib/auth/branch";
import { getHousekeepingSummary } from "@/lib/adapters/housekeeping";
import type { HousekeepingTask } from "@/lib/adapters/housekeeping";

const COLUMNS = [
  { key: "roomNumber", header: "Room" },
  { key: "floor", header: "Floor" },
  { key: "status", header: "Status", render: (r: HousekeepingTask) => <Badge label={r.status} /> },
  { key: "priority", header: "Priority", render: (r: HousekeepingTask) => <Badge label={r.priority} variant={r.priority === "HIGH" ? "danger" : r.priority === "NORMAL" ? "info" : "neutral"} /> },
  { key: "assignedTo", header: "Assigned To", render: (r: HousekeepingTask) => r.assignedTo ?? "Unassigned" },
  { key: "estimatedMinutes", header: "Est. Time", render: (r: HousekeepingTask) => `${r.estimatedMinutes} min` },
];

export default async function HousekeepingPage() {
  const active = await getActiveBranch();
  const summary = active?.branchId ? await getHousekeepingSummary(active.branchId) : null;

  return (
    <>
      <TopBar title="Housekeeping" subtitle="Room turnaround and cleaning status" dataSource="mock" />

      <div className="mt-6 space-y-6">
        <Alert variant="preview" icon={<Sparkles className="h-4 w-4" />} title="Preview module">
          hotelmind-backend has no housekeeping module yet — this screen is a fully-designed preview backed by
          simulated data (lib/adapters/housekeeping) so the workflow can be demonstrated and validated before a real
          integration exists.
        </Alert>

        {summary && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {(["DIRTY", "IN_PROGRESS", "INSPECTED", "CLEAN"] as const).map((status) => (
                <div key={status} className="rounded-xl border border-border bg-card p-4 text-center shadow-xs">
                  <Badge label={status} />
                  <p className="mt-2 text-2xl font-bold text-foreground">{summary.counts[status]}</p>
                </div>
              ))}
              <div className="rounded-xl border border-border bg-card p-4 text-center shadow-xs">
                <p className="text-xs text-muted-foreground">Avg. Turnaround</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{summary.avgTurnaroundMinutes}m</p>
              </div>
            </div>

            <DataTable<HousekeepingTask>
              columns={COLUMNS as never}
              data={summary.tasks}
              keyExtractor={(r) => r.id}
              emptyMessage="No housekeeping tasks."
            />
          </>
        )}
      </div>
    </>
  );
}
