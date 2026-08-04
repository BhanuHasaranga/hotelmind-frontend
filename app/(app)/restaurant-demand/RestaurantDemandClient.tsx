"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { DemandForecastChart } from "@/components/restaurant-demand/DemandForecastChart";
import { PrepListPanel } from "@/components/restaurant-demand/PrepListPanel";
import { forecastRestaurantDemand } from "@/lib/api/ml";
import type { FoodCategory, MenuItem } from "@/lib/types/restaurant";
import type { RestaurantDemandResponse } from "@/lib/types/ml";

interface RestaurantDemandClientProps {
  token: string;
  branchId: string;
  categories: FoodCategory[];
  menuItems: MenuItem[];
  recentOrderCounts: { lag1: number; lag7: number; rollingMean7: number; avgItemValue: number };
}

export function RestaurantDemandClient({
  token,
  branchId,
  categories,
  menuItems,
  recentOrderCounts,
}: RestaurantDemandClientProps) {
  const { toast } = useToast();
  const [forecast, setForecast] = useState<RestaurantDemandResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGetForecast() {
    setLoading(true);
    try {
      const result = await forecastRestaurantDemand(token, {
        branch_id: branchId,
        date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        recent_total_orders_lag_1: recentOrderCounts.lag1,
        recent_total_orders_lag_7: recentOrderCounts.lag7,
        recent_total_orders_rolling_mean_7: recentOrderCounts.rollingMean7,
        avg_item_value: recentOrderCounts.avgItemValue,
      });
      setForecast(result);
    } catch (err) {
      toast({
        title: "Could not get demand forecast",
        description: err instanceof Error ? err.message : "The ML service may be unavailable.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tomorrow&apos;s Demand Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Button size="sm" onClick={handleGetForecast} disabled={loading}>
            {loading ? "Forecasting…" : "Get Forecast"}
          </Button>
        </CardContent>
      </Card>

      {loading && <Skeleton className="h-64 w-full" />}

      {forecast && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Expected Orders by Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <DemandForecastChart forecast={forecast} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prep Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <PrepListPanel token={token} categories={categories} menuItems={menuItems} forecast={forecast} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
