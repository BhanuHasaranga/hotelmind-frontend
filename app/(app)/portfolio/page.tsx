import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { Alert } from "@/components/ui/Alert";
import { Sparkles } from "lucide-react";
import { getActiveBranch } from "@/lib/auth/branch";
import { getPortfolioSummary } from "@/lib/adapters/portfolio";
import type { PropertyPerformance } from "@/lib/adapters/portfolio";

function makeColumns(bestId: string, worstId: string) {
  return [
    {
      key: "branchName",
      header: "Property",
      render: (r: PropertyPerformance) => (
        <span className="flex items-center gap-1.5">
          {r.hotelName} — {r.branchName}
          {r.id === bestId && <Badge label="Top performer" variant="success" />}
          {r.id === worstId && <Badge label="Needs attention" variant="danger" />}
        </span>
      ),
    },
    { key: "occupancyPct", header: "Occupancy", render: (r: PropertyPerformance) => `${r.occupancyPct}%` },
    { key: "adr", header: "ADR", render: (r: PropertyPerformance) => `$${r.adr}` },
    { key: "revPar", header: "RevPAR", render: (r: PropertyPerformance) => `$${r.revPar}` },
    { key: "revenueMtd", header: "Revenue MTD", render: (r: PropertyPerformance) => `$${r.revenueMtd.toLocaleString()}` },
    { key: "guestSatisfaction", header: "Guest Satisfaction", render: (r: PropertyPerformance) => `${r.guestSatisfaction} / 5` },
  ];
}

export default async function PortfolioPage() {
  const active = await getActiveBranch();
  const summary = active?.branchId ? await getPortfolioSummary(active.branchId) : null;

  return (
    <>
      <TopBar title="Multi-Property Rollup" subtitle="Cross-property performance comparison" dataSource="mock" />

      <div className="mt-6 space-y-6">
        <Alert variant="mock" icon={<Sparkles className="h-4 w-4" />} title="Preview module">
          hotelmind-backend supports a single hotel group with multiple branches but has no portfolio-of-brands or
          cross-property rollup reporting yet — this screen is a fully-designed preview backed by simulated data
          (lib/adapters/portfolio), scoped to OWNER sessions.
        </Alert>

        {summary && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard label="Portfolio RevPAR" value={`$${summary.portfolioRevPar}`} icon="revenue" accent="success" />
              <StatCard label="Portfolio Occupancy" value={`${summary.portfolioOccupancyPct}%`} icon="hotel" accent="brand" />
            </div>

            <DataTable<PropertyPerformance>
              columns={makeColumns(summary.bestPerformerId, summary.worstPerformerId) as never}
              data={summary.properties}
              keyExtractor={(r) => r.id}
              emptyMessage="No properties found."
            />
          </>
        )}
      </div>
    </>
  );
}
