"use client";

import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { Recommendation } from "@/lib/types/ml";

interface RecommendationHistoryTableProps {
  recommendations: Recommendation[];
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  ACCEPTED: "success",
  MODIFIED: "info",
  DISMISSED: "neutral",
  SHOWN: "warning",
};

type Row = Recommendation & {
  recommendedPrice: number;
  appliedPrice: number | null;
  outcomeDelta: number | null;
};

export function RecommendationHistoryTable({ recommendations }: RecommendationHistoryTableProps) {
  const rows: Row[] = recommendations.map((r) => ({
    ...r,
    recommendedPrice: Number(r.payload.clamped_price ?? r.payload.recommended_price ?? 0),
    appliedPrice: r.applied_value?.price != null ? Number(r.applied_value.price) : null,
    outcomeDelta: r.outcome_delta,
  }));

  return (
    <DataTable<Row>
      columns={[
        {
          key: "shown_at",
          header: "Date",
          render: (r) =>
            new Date(r.shown_at).toLocaleDateString("en-US", { timeZone: "UTC" }),
        },
        {
          key: "recommendedPrice",
          header: "Recommended",
          render: (r) => `$${r.recommendedPrice.toFixed(2)}`,
        },
        {
          key: "status",
          header: "Status",
          render: (r) => <Badge label={r.status} variant={STATUS_VARIANT[r.status]} />,
        },
        {
          key: "appliedPrice",
          header: "Applied",
          render: (r) => (r.appliedPrice != null ? `$${r.appliedPrice.toFixed(2)}` : "—"),
        },
        {
          key: "outcomeDelta",
          header: "Outcome",
          render: (r) =>
            r.outcomeDelta != null ? (
              <span
                className={
                  r.outcomeDelta >= 0
                    ? "font-medium text-[var(--color-success-fg)]"
                    : "font-medium text-[var(--color-danger-fg)]"
                }
              >
                {r.outcomeDelta >= 0 ? "+" : ""}
                ${r.outcomeDelta.toFixed(2)}
              </span>
            ) : (
              <span className="text-gray-400">Not measured</span>
            ),
        },
      ]}
      data={rows}
      keyExtractor={(r) => r.id}
      emptyMessage="No pricing recommendations yet — request one above."
    />
  );
}
