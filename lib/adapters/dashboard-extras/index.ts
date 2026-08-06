import { getDashboardExtras as getMockDashboardExtras } from "./mock";
import type { DashboardExtras } from "./types";

/**
 * All dashboard-extras sub-metrics are currently "mock" in the capability
 * registry (lib/adapters/config.ts). When the backend adds a real endpoint,
 * branch on the relevant CAPABILITIES key here — callers (the dashboard
 * page) never change.
 */
export async function getDashboardExtras(branchId: string): Promise<DashboardExtras> {
  return getMockDashboardExtras(branchId);
}

export type { DashboardExtras } from "./types";
