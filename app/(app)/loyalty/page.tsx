import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { Alert } from "@/components/ui/Alert";
import { Sparkles } from "lucide-react";
import { getActiveBranch } from "@/lib/auth/branch";
import { getLoyaltySummary } from "@/lib/adapters/loyalty";
import type { LoyaltyMember } from "@/lib/adapters/loyalty";

const TIER_VARIANT = { SILVER: "neutral", GOLD: "warning", PLATINUM: "mock" } as const;

const COLUMNS = [
  { key: "guestName", header: "Guest" },
  { key: "tier", header: "Tier", render: (r: LoyaltyMember) => <Badge label={r.tier} variant={TIER_VARIANT[r.tier]} /> },
  { key: "pointsBalance", header: "Points", render: (r: LoyaltyMember) => r.pointsBalance.toLocaleString() },
  { key: "lifetimeStays", header: "Lifetime Stays" },
  { key: "lastStay", header: "Last Stay" },
  { key: "memberSince", header: "Member Since" },
];

export default async function LoyaltyPage() {
  const active = await getActiveBranch();
  const summary = active?.branchId ? await getLoyaltySummary(active.branchId) : null;

  return (
    <>
      <TopBar title="Guest Directory & Loyalty" subtitle="Cross-stay guest identity and loyalty tiers" dataSource="mock" />

      <div className="mt-6 space-y-6">
        <Alert variant="mock" icon={<Sparkles className="h-4 w-4" />} title="Preview module">
          hotelmind-backend has no CRM/loyalty module or persistent cross-stay guest profile yet — this screen is a
          fully-designed preview backed by simulated data (lib/adapters/loyalty).
        </Alert>

        {summary && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <StatCard label="Silver Members" value={summary.tierCounts.SILVER} accent="blue" />
              <StatCard label="Gold Members" value={summary.tierCounts.GOLD} accent="amber" />
              <StatCard label="Platinum Members" value={summary.tierCounts.PLATINUM} accent="purple" />
              <StatCard label="Points Liability" value={summary.totalPointsLiability.toLocaleString()} accent="green" />
            </div>

            <DataTable<LoyaltyMember>
              columns={COLUMNS as never}
              data={summary.members}
              keyExtractor={(r) => r.id}
              emptyMessage="No loyalty members found."
            />
          </>
        )}
      </div>
    </>
  );
}
