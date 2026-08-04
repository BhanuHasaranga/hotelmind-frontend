"use client";

import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import type { RestaurantDemandResponse } from "@/lib/types/ml";

interface DemandForecastChartProps {
  forecast: RestaurantDemandResponse;
}

export function DemandForecastChart({ forecast }: DemandForecastChartProps) {
  const data = [
    { meal: "Breakfast", quantity: forecast.breakfast.expected_quantity, revenue: forecast.breakfast.expected_revenue },
    { meal: "Lunch", quantity: forecast.lunch.expected_quantity, revenue: forecast.lunch.expected_revenue },
    { meal: "Dinner", quantity: forecast.dinner.expected_quantity, revenue: forecast.dinner.expected_revenue },
  ];

  return (
    <BarComparisonChart
      data={data}
      xKey="meal"
      series={[{ key: "quantity", label: "Expected orders", color: "#1d4ed8" }]}
    />
  );
}
