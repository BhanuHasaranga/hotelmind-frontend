import { getMaintenanceSummary as getMockMaintenanceSummary } from "./mock";
import type { MaintenanceSummary } from "./types";

/**
 * maintenance is "mock" in the capability registry (lib/adapters/config.ts)
 * — hotelmind-backend has no maintenance ticketing module. Once it does,
 * branch on CAPABILITIES.maintenance here and call apiFetchAuthed instead;
 * the page consuming this function does not need to change.
 */
export async function getMaintenanceSummary(branchId: string): Promise<MaintenanceSummary> {
  return getMockMaintenanceSummary(branchId);
}

export type { MaintenanceSummary, MaintenanceTicket, MaintenanceStatus, MaintenancePriority, MaintenanceCategory } from "./types";
