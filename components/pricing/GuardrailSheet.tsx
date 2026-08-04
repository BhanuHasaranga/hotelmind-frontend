"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import type { PricingGuardrail } from "@/lib/types/ml";

interface GuardrailSheetProps {
  open: boolean;
  onClose: () => void;
  branchId: string;
  roomTypeId: string;
  existing: PricingGuardrail | null;
  onSave: (values: { minPrice: number; maxPrice: number; maxDailyChangePct: number }) => Promise<void>;
}

export function GuardrailSheet({ open, onClose, existing, onSave }: GuardrailSheetProps) {
  const [minPrice, setMinPrice] = useState(existing?.min_price?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(existing?.max_price?.toString() ?? "");
  const [maxDailyChangePct, setMaxDailyChangePct] = useState(
    existing?.max_daily_change_pct?.toString() ?? "25",
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    const pct = Number(maxDailyChangePct);

    if (!minPrice || !maxPrice || Number.isNaN(min) || Number.isNaN(max)) {
      setError("Enter valid min and max prices.");
      return;
    }
    if (min > max) {
      setError("Min price must be less than or equal to max price.");
      return;
    }

    setError(null);
    setPending(true);
    try {
      await onSave({ minPrice: min, maxPrice: max, maxDailyChangePct: pct });
      onClose();
    } finally {
      setPending(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Pricing Guardrails">
      <p className="mb-4 text-sm text-gray-500">
        AI price recommendations are clamped to this range before they can be applied — this
        protects against a model suggestion violating a franchise agreement or ownership rule.
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Minimum price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            placeholder="e.g. 80"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Maximum price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            placeholder="e.g. 400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
            Max daily change (%)
          </label>
          <input
            type="number"
            value={maxDailyChangePct}
            onChange={(e) => setMaxDailyChangePct(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-[var(--color-danger-bg)] px-3 py-2 text-sm text-[var(--color-danger-fg)]">
            {error}
          </p>
        )}

        <Button className="w-full" onClick={handleSave} disabled={pending}>
          {pending ? "Saving…" : "Save guardrail"}
        </Button>
      </div>
    </Sheet>
  );
}
