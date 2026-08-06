import { getFrontDeskSummary as getMockFrontDeskSummary } from "./mock";
import type { FrontDeskSummary } from "./types";

/**
 * frontDesk is "mock" in the capability registry (lib/adapters/config.ts) —
 * hotelmind-backend has no check-in/check-out workflow beyond the booking
 * status enum. Once a real front-desk endpoint exists, branch on
 * CAPABILITIES.frontDesk here; the page consuming this function does not
 * need to change.
 */
export async function getFrontDeskSummary(branchId: string): Promise<FrontDeskSummary> {
  return getMockFrontDeskSummary(branchId);
}

export type { FrontDeskSummary, FrontDeskEntry, FrontDeskStage } from "./types";
