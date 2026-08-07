"use client";

import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { CHART } from "@/lib/chart-colors";
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
        // Actual = brand green (the real, authoritative series); forecast =
        // champagne, tying the predicted series to HotelMind's AI/premium accent.
        { key: "actual_occupancy_pct", label: "Actual occupancy", color: CHART.primary },
        { key: "predicted_occupancy_pct", label: "Forecast occupancy", color: CHART.highlight },
      ]}
      band={{ upperKey: "ci_upper", lowerKey: "ci_lower", color: CHART.highlight, label: "Forecast confidence" }}
    />
  );
}
