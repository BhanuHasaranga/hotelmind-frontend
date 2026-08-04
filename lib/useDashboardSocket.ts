"use client";

import { useEffect, useRef, useState } from "react";

const WS_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/^http/, "ws");

export interface DashboardUpdate {
  type: string;
  event_type?: string;
  branch_id?: string;
  [key: string]: unknown;
}

export function useDashboardSocket() {
  const [lastUpdate, setLastUpdate] = useState<DashboardUpdate | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    function connect() {
      if (cancelled) return;
      const socket = new WebSocket(`${WS_BASE_URL}/ws/dashboard`);
      socketRef.current = socket;

      socket.onopen = () => setConnected(true);
      socket.onclose = () => {
        setConnected(false);
        if (!cancelled) reconnectTimer = setTimeout(connect, 3000);
      };
      socket.onerror = () => socket.close();
      socket.onmessage = (event) => {
        try {
          setLastUpdate(JSON.parse(event.data) as DashboardUpdate);
        } catch {
          // ignore malformed payloads
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socketRef.current?.close();
    };
  }, []);

  return { lastUpdate, connected };
}
