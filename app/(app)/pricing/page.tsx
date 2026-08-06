import { TopBar } from "@/components/layout/TopBar";
import { PricingClient } from "./PricingClient";
import { apiFetchAuthed } from "@/lib/api";
import { getActiveBranch } from "@/lib/auth/branch";
import { listPricingGuardrails, listRecommendations } from "@/lib/api/ml";
import type { RoomType } from "@/lib/types/hotel";
import type { DailyOccupancy, DashboardSummary } from "@/lib/types/dashboard";

async function getRoomTypes(branchId: string, token: string): Promise<RoomType[]> {
  try {
    return await apiFetchAuthed<RoomType[]>(`/api/v1/hotels/branches/${branchId}/room-types`, token);
  } catch {
    return [];
  }
}

async function getSummary(branchId: string, token: string): Promise<DashboardSummary | null> {
  try {
    return await apiFetchAuthed<DashboardSummary>(`/api/v1/dashboard/summary?branch_id=${branchId}`, token);
  } catch {
    return null;
  }
}

async function getOccupancyHistory(branchId: string, token: string): Promise<DailyOccupancy[]> {
  try {
    return await apiFetchAuthed<DailyOccupancy[]>(
      `/api/v1/dashboard/occupancy?branch_id=${branchId}&days=14`,
      token,
    );
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const active = await getActiveBranch();

  if (!active?.branchId) {
    return (
      <>
        <TopBar title="Pricing Intelligence" subtitle="AI-recommended room pricing" dataSource="real" />
        <p className="mt-6 text-sm text-muted-foreground">
          Select a branch from the switcher above to view pricing recommendations.
        </p>
      </>
    );
  }

  const { branchId, session } = active;
  const [roomTypes, summary, occupancyHistory, recommendations, guardrails] = await Promise.all([
    getRoomTypes(branchId, session.token),
    getSummary(branchId, session.token),
    getOccupancyHistory(branchId, session.token),
    listRecommendations(session.token, branchId, "PRICING").catch(() => []),
    listPricingGuardrails(session.token, branchId).catch(() => []),
  ]);

  return (
    <>
      <TopBar title="Pricing Intelligence" subtitle="AI-recommended room pricing" dataSource="real" />
      <div className="mt-6">
        <PricingClient
          token={session.token}
          branchId={branchId}
          roomTypes={roomTypes}
          occupancyHistory={occupancyHistory}
          currentOccupancyPct={summary?.occupancy_pct ?? 0}
          currentRevenue={Number(summary?.revenue_today ?? 0)}
          revenue7dayAvg={Number(summary?.revenue_mtd ?? 0) / 30}
          totalRooms={summary?.total_rooms ?? 0}
          initialRecommendations={recommendations}
          initialGuardrails={guardrails}
        />
      </div>
    </>
  );
}
