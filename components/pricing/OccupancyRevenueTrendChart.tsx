"use client";

import { TrendLineChart } from "@/components/charts/TrendLineChart";
import type { DailyOccupancy } from "@/lib/types/dashboard";
import type { OccupancyDayForecast } from "@/lib/types/ml";

interface OccupancyRevenueTrendChartProps {
  history: DailyOccupancy[];
  forecast: OccupancyDayForecast[];
}

export function OccupancyRevenueTrendChart({ history, forecast }: OccupancyRevenueTrendChartProps) {
  const historyRows = history.map((d) => ({
    date: d.date,
    actual_occupancy_pct: d.occupancy_pct,
  }));

  const forecastRows = forecast.map((f) => ({
    date: f.date,
    predicted_occupancy_pct: f.predicted_occupancy_pct,
    ci_lower: f.ci_lower,
    ci_upper: f.ci_upper,
  }));

  const data = [...historyRows, ...forecastRows];

  return (
    <TrendLineChart
      data={data}
      xKey="date"
      series={[
        { key: "actual_occupancy_pct", label: "Actual occupancy", color: "#1d4ed8" },
        { key: "predicted_occupancy_pct", label: "Forecast occupancy", color: "#16a34a" },
      ]}
      band={{ upperKey: "ci_upper", lowerKey: "ci_lower", color: "#16a34a", label: "Forecast confidence" }}
    />
  );
}
