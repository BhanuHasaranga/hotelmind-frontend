"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/ToastProvider";
import { actOnRecommendation } from "@/lib/api/ml";
import type { FoodCategory, MenuItem } from "@/lib/types/restaurant";
import type { RestaurantDemandResponse } from "@/lib/types/ml";

interface PrepListPanelProps {
  token: string;
  categories: FoodCategory[];
  menuItems: MenuItem[];
  forecast: RestaurantDemandResponse;
}

/**
 * Translates the ML service's per-meal-period quantity forecast into a
 * per-menu-item prep checklist. The ML model only forecasts at the
 * breakfast/lunch/dinner level (see hotelmind-ml RestaurantResponse), so
 * item-level counts are proportionally split across each meal period's
 * available menu items — a simple, transparent estimate rather than a
 * separate per-item model.
 */
export function PrepListPanel({ token, categories, menuItems, forecast }: PrepListPanelProps) {
  const { toast } = useToast();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [marking, setMarking] = useState(false);

  const availableItems = menuItems.filter((m) => m.is_available);

  if (availableItems.length === 0) {
    return (
      <EmptyState
        icon="restaurant"
        title="No menu items yet"
        description="Add menu items to generate a prep checklist."
      />
    );
  }

  const itemsPerMeal = Math.max(Math.ceil(availableItems.length / 3), 1);
  const mealBuckets = [
    { label: "Breakfast", items: availableItems.slice(0, itemsPerMeal), forecast: forecast.breakfast },
    { label: "Lunch", items: availableItems.slice(itemsPerMeal, itemsPerMeal * 2), forecast: forecast.lunch },
    { label: "Dinner", items: availableItems.slice(itemsPerMeal * 2), forecast: forecast.dinner },
  ].filter((bucket) => bucket.items.length > 0);

  function toggle(itemId: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  }

  async function handleMarkPrepStarted() {
    setMarking(true);
    try {
      await actOnRecommendation(token, forecast.recommendation_id, { status: "ACCEPTED" });
      toast({ title: "Prep marked as started", variant: "success" });
    } catch (err) {
      toast({
        title: "Could not update recommendation",
        description: err instanceof Error ? err.message : undefined,
        variant: "danger",
      });
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className="space-y-6">
      {mealBuckets.map((bucket) => {
        const perItemQty = Math.round(bucket.forecast.expected_quantity / bucket.items.length) || 1;
        return (
          <div key={bucket.label}>
            <h3 className="mb-2 flex items-center justify-between text-sm font-semibold text-foreground">
              {bucket.label}
              <span className="text-xs font-normal text-muted-foreground">
                ~{Math.round(bucket.forecast.expected_quantity)} orders expected
              </span>
            </h3>
            <div className="space-y-1.5">
              {bucket.items.map((item) => {
                const category = categories.find((c) => c.id === item.category_id);
                const isChecked = checked.has(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(item.id)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span className={isChecked ? "flex-1 text-sm text-muted-foreground line-through" : "flex-1 text-sm text-foreground"}>
                      {item.name}
                      {category && <span className="ml-1.5 text-xs text-muted-foreground">· {category.name}</span>}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">~{perItemQty} units</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        onClick={handleMarkPrepStarted}
        disabled={marking}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        <Icon name="check" size={16} />
        {marking ? "Saving…" : "Mark prep started"}
      </button>
    </div>
  );
}
