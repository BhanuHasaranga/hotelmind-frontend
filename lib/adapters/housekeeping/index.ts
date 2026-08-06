import { getHousekeepingSummary as getMockHousekeepingSummary } from "./mock";
import type { HousekeepingSummary } from "./types";

/**
 * housekeeping is "mock" in the capability registry (lib/adapters/config.ts)
 * — hotelmind-backend has no housekeeping module. Once it does, branch on
 * CAPABILITIES.housekeeping here and call apiFetchAuthed instead; the page
 * consuming this function does not need to change.
 */
export async function getHousekeepingSummary(branchId: string): Promise<HousekeepingSummary> {
  return getMockHousekeepingSummary(branchId);
}

export type { HousekeepingSummary, HousekeepingTask, HousekeepingStatus } from "./types";
