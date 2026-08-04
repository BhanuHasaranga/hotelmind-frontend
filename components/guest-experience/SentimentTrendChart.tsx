"use client";

import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { EmptyState } from "@/components/ui/EmptyState";

interface SentimentTrendChartProps {
  series: Record<string, unknown>[];
}

/**
 * The ML service's /reviews/trends returns a free-form `series: list[dict]`
 * (see hotelmind-ml ReviewsTrendsResponse) rather than a typed shape, so this
 * reads defensively — falls back to an empty state if the expected keys
 * ("period"/"date" and a sentiment/score field) aren't present.
 */
export function SentimentTrendChart({ series }: SentimentTrendChartProps) {
  if (series.length === 0) {
    return <EmptyState icon="guestExperience" title="No trend data yet" description="Check back once more reviews have been analyzed." />;
  }

  const xKey = "period" in series[0] ? "period" : "date" in series[0] ? "date" : Object.keys(series[0])[0];
  const scoreKey =
    ["avg_sentiment_score", "sentiment_score", "score", "avg_score"].find((k) => k in series[0]) ??
    Object.keys(series[0]).find((k) => k !== xKey && typeof series[0][k] === "number");

  if (!scoreKey) {
    return <EmptyState icon="guestExperience" title="Unexpected data shape" description="Could not render the sentiment trend." />;
  }

  return (
    <TrendLineChart
      data={series}
      xKey={xKey}
      series={[{ key: scoreKey, label: "Sentiment score", color: "#1d4ed8" }]}
    />
  );
}
