import { getLoyaltySummary as getMockLoyaltySummary } from "./mock";
import type { LoyaltySummary } from "./types";

/**
 * loyalty is "mock" in the capability registry (lib/adapters/config.ts) —
 * hotelmind-backend has no CRM/loyalty module and no persistent cross-stay
 * guest identity. Once it does, branch on CAPABILITIES.loyalty here; the
 * page consuming this function does not need to change.
 */
export async function getLoyaltySummary(branchId: string): Promise<LoyaltySummary> {
  return getMockLoyaltySummary(branchId);
}

export type { LoyaltySummary, LoyaltyMember, LoyaltyTier } from "./types";
