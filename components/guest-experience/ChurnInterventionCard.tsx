"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { actOnRecommendation } from "@/lib/api/ml";
import type { ChurnPredictResponse } from "@/lib/types/ml";

const RISK_VARIANT: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

interface ChurnInterventionCardProps {
  token: string;
  guestLabel: string;
  prediction: ChurnPredictResponse;
  onResolved: () => void;
}

export function ChurnInterventionCard({ token, guestLabel, prediction, onResolved }: ChurnInterventionCardProps) {
  const [pending, setPending] = useState(false);

  async function handleAction(status: "ACCEPTED" | "DISMISSED") {
    if (!prediction.recommendation_id) {
      onResolved();
      return;
    }
    setPending(true);
    try {
      await actOnRecommendation(token, prediction.recommendation_id, { status });
      onResolved();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon name="churnRisk" size={16} className="text-[var(--color-danger-fg)]" />
          <CardTitle>{guestLabel}</CardTitle>
        </div>
        <Badge label={prediction.risk_level} variant={RISK_VARIANT[prediction.risk_level] ?? "neutral"} />
      </CardHeader>
      <CardContent>
        {prediction.churn_probability != null && (
          <p className="text-sm text-foreground">
            {Math.round(prediction.churn_probability * 100)}% churn probability
          </p>
        )}
        {prediction.note && <p className="mt-1 text-xs text-muted-foreground">{prediction.note}</p>}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={() => handleAction("DISMISSED")} disabled={pending}>
          Dismiss
        </Button>
        <Button size="sm" onClick={() => handleAction("ACCEPTED")} disabled={pending}>
          Mark as followed up
        </Button>
      </CardFooter>
    </Card>
  );
}
