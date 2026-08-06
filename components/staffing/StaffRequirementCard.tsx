"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { StaffRequirementResponse } from "@/lib/types/ml";

interface StaffRequirementCardProps {
  departmentName: string;
  scheduledEmployees: number;
  requirement: StaffRequirementResponse;
  onAccept: () => Promise<void>;
  onDismiss: () => Promise<void>;
}

export function StaffRequirementCard({
  departmentName,
  scheduledEmployees,
  requirement,
  onAccept,
  onDismiss,
}: StaffRequirementCardProps) {
  const [pending, setPending] = useState(false);
  const gap = requirement.required_staff - scheduledEmployees;

  async function handleAccept() {
    setPending(true);
    try {
      await onAccept();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{departmentName}</CardTitle>
        {gap !== 0 && (
          <span
            className={
              gap > 0
                ? "flex items-center gap-1 rounded-full bg-[var(--color-warning-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-warning-fg)]"
                : "flex items-center gap-1 rounded-full bg-[var(--color-info-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-info-fg)]"
            }
          >
            <Icon name={gap > 0 ? "alert" : "trendDown"} size={12} />
            {gap > 0 ? `${gap} short` : `${Math.abs(gap)} over`}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-4">
          <div>
            <p className="text-2xl font-bold text-foreground">{requirement.required_staff}</p>
            <p className="text-xs text-muted-foreground">Recommended</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-muted-foreground">{scheduledEmployees}</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{requirement.confidence_note}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={onDismiss} disabled={pending}>
          Dismiss
        </Button>
        <Button size="sm" onClick={handleAccept} disabled={pending}>
          {pending ? "Saving…" : "Acknowledge"}
        </Button>
      </CardFooter>
    </Card>
  );
}
