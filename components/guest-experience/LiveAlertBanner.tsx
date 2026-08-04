"use client";

import { useEffect, useState } from "react";
import { useDashboardSocket } from "@/lib/useDashboardSocket";
import { Icon } from "@/components/ui/Icon";

interface LiveAlertBannerProps {
  token: string;
}

interface GuestAlert {
  id: string;
  message: string;
}

/**
 * Real-time guest-recovery alert: the backend's pubsub bridge broadcasts
 * every dashboard-relevant event (see app/websocket/pubsub_bridge.py) over
 * one shared /ws/dashboard socket, so this filters for churn-risk and
 * low-rating review events specifically rather than opening a second socket.
 */
export function LiveAlertBanner({ token }: LiveAlertBannerProps) {
  const { lastUpdate, connected } = useDashboardSocket(token);
  const [alerts, setAlerts] = useState<GuestAlert[]>([]);

  useEffect(() => {
    if (!lastUpdate) return;

    // See app/handlers/ml_handlers.py and review_handlers.py for the exact
    // shapes published over the shared dashboard pubsub channel.
    if (lastUpdate.type === "churn_prediction") {
      const data = lastUpdate.data as { risk_level?: string } | undefined;
      if (data?.risk_level === "HIGH") {
        setAlerts((prev) =>
          [
            {
              id: crypto.randomUUID(),
              message: "A guest currently in-house shows high churn risk — consider a service recovery gesture.",
            },
            ...prev,
          ].slice(0, 3),
        );
      }
      return;
    }

    if (lastUpdate.type === "review" && lastUpdate.event_type === "ReviewCreated") {
      const payload = lastUpdate.payload as { rating?: number } | undefined;
      if (typeof payload?.rating === "number" && payload.rating <= 2) {
        setAlerts((prev) =>
          [
            {
              id: crypto.randomUUID(),
              message: `A guest just left a ${payload.rating}-star review — reach out before checkout.`,
            },
            ...prev,
          ].slice(0, 3),
        );
      }
    }
  }, [lastUpdate]);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center gap-3 rounded-xl border border-[var(--color-danger-fg)]/20 bg-[var(--color-danger-bg)] px-4 py-3 text-sm text-[var(--color-danger-fg)]"
        >
          <Icon name="live" size={16} className={connected ? "animate-pulse" : ""} />
          {alert.message}
          <button
            onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
            className="ml-auto text-xs opacity-70 hover:opacity-100"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
