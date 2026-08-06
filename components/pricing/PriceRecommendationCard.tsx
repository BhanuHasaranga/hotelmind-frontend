"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import type { PricingRecommendResponse } from "@/lib/types/ml";

interface PriceRecommendationCardProps {
  recommendation: PricingRecommendResponse;
  currentPrice: number;
  onAccept: () => Promise<void>;
  onDismiss: () => Promise<void>;
}

export function PriceRecommendationCard({
  recommendation,
  currentPrice,
  onAccept,
  onDismiss,
}: PriceRecommendationCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const delta = recommendation.recommended_price - currentPrice;
  const deltaPct = currentPrice > 0 ? (delta / currentPrice) * 100 : 0;
  const isIncrease = delta > 0;

  async function handleConfirm() {
    setPending(true);
    try {
      await onAccept();
      setConfirmOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Price</CardTitle>
        {recommendation.guardrail_clamped && (
          <span className="rounded-full bg-[var(--color-warning-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-warning-fg)]">
            Clamped by guardrail
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-3">
          <p className="text-3xl font-bold text-foreground">
            ${recommendation.recommended_price.toFixed(2)}
          </p>
          <span
            className={
              isIncrease
                ? "flex items-center gap-1 text-sm font-medium text-[var(--color-success-fg)]"
                : "flex items-center gap-1 text-sm font-medium text-[var(--color-danger-fg)]"
            }
          >
            {isIncrease ? "+" : ""}
            {deltaPct.toFixed(1)}%
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Current price: ${currentPrice.toFixed(2)} · Expected revenue: $
          {recommendation.expected_revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>

        {recommendation.meta && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon name="insight" size={12} />
            Model v{recommendation.meta.model_version}
            {recommendation.meta.confidence != null &&
              ` · ${Math.round(recommendation.meta.confidence * 100)}% confidence`}
            {" · "}
            {new Date(recommendation.meta.trained_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={onDismiss} disabled={pending}>
          Dismiss
        </Button>
        <Button size="sm" onClick={() => setConfirmOpen(true)} disabled={pending}>
          Accept &amp; Apply
        </Button>
      </CardFooter>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Apply new price?"
        description={`This updates the room type's base price to $${recommendation.recommended_price.toFixed(2)} immediately.`}
        confirmLabel={pending ? "Applying…" : "Apply price"}
        onConfirm={handleConfirm}
      />
    </Card>
  );
}
