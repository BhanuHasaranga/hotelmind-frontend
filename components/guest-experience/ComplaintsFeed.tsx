"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/ToastProvider";
import { ChurnInterventionCard } from "./ChurnInterventionCard";
import { predictChurn } from "@/lib/api/ml";
import type { ChurnPredictResponse } from "@/lib/types/ml";

interface ComplaintsFeedProps {
  token: string;
  complaints: Record<string, unknown>[];
}

function complaintText(row: Record<string, unknown>): string {
  const value = row.comment ?? row.text ?? row.complaint ?? row.summary;
  return typeof value === "string" ? value : "Untitled complaint";
}

function complaintGuestId(row: Record<string, unknown>): string | null {
  const value = row.guest_id;
  return typeof value === "string" ? value : null;
}

function complaintDate(row: Record<string, unknown>): string | null {
  const value = row.date ?? row.created_at;
  return typeof value === "string" ? value : null;
}

export function ComplaintsFeed({ token, complaints }: ComplaintsFeedProps) {
  const { toast } = useToast();
  const [flagged, setFlagged] = useState<Record<string, ChurnPredictResponse>>({});
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  async function handleFlag(index: number, guestId: string) {
    setPendingIndex(index);
    try {
      const result = await predictChurn(token, guestId);
      setFlagged((prev) => ({ ...prev, [guestId]: result }));
    } catch (err) {
      toast({
        title: "Could not check churn risk",
        description: err instanceof Error ? err.message : "The ML service may be unavailable.",
        variant: "danger",
      });
    } finally {
      setPendingIndex(null);
    }
  }

  const visibleComplaints = complaints.filter((_, i) => !dismissed.has(i));

  if (visibleComplaints.length === 0) {
    return (
      <EmptyState
        icon="complaint"
        title="No complaints right now"
        description="New complaints from guest reviews will show up here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {visibleComplaints.map((complaint, i) => {
        const guestId = complaintGuestId(complaint);
        const flaggedResult = guestId ? flagged[guestId] : undefined;

        return (
          <div key={i} className="space-y-2">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Icon name="complaint" size={16} className="mt-0.5 shrink-0 text-[var(--color-warning-fg)]" />
                  <div>
                    <p className="text-sm text-foreground">{complaintText(complaint)}</p>
                    {complaintDate(complaint) && (
                      <p className="mt-1 text-xs text-muted-foreground">{complaintDate(complaint)}</p>
                    )}
                  </div>
                </div>
                {guestId && !flaggedResult && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleFlag(i, guestId)}
                    disabled={pendingIndex === i}
                  >
                    {pendingIndex === i ? "Checking…" : "Flag for follow-up"}
                  </Button>
                )}
              </div>
            </div>

            {flaggedResult && (
              <ChurnInterventionCard
                token={token}
                guestLabel={`Guest ${guestId?.slice(0, 8)}…`}
                prediction={flaggedResult}
                onResolved={() => setDismissed((prev) => new Set(prev).add(i))}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
