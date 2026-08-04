"use client";

import { useDashboardSocket } from "@/lib/useDashboardSocket";

interface LiveOccupancyBadgeProps {
  initialOccupancyPct: number | null;
  token?: string;
}

export function LiveOccupancyBadge({ initialOccupancyPct, token }: LiveOccupancyBadgeProps) {
  const { lastUpdate, connected } = useDashboardSocket(token);

  const liveOccupancyPct =
    lastUpdate?.type === "occupancy_changed" && typeof lastUpdate.occupancy_pct === "number"
      ? lastUpdate.occupancy_pct
      : null;

  const displayPct = liveOccupancyPct ?? initialOccupancyPct;

  return (
    <span className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
      <span
        className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-gray-400"}`}
        title={connected ? "Live" : "Reconnecting…"}
      />
      {displayPct !== null ? `Live: ${displayPct.toFixed(1)}%` : connected ? "Waiting for updates…" : "Connecting…"}
    </span>
  );
}
