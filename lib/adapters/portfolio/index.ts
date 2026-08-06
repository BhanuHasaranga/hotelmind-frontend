import { getPortfolioSummary as getMockPortfolioSummary } from "./mock";
import type { PortfolioSummary } from "./types";

/**
 * portfolioRollup is "mock" in the capability registry (lib/adapters/config.ts)
 * — hotelmind-backend has no multi-property/portfolio rollup, only a single
 * hotel-group + multi-branch hierarchy. Once a real cross-property reporting
 * endpoint exists, branch on CAPABILITIES.portfolioRollup here; the page
 * consuming this function does not need to change.
 */
export async function getPortfolioSummary(branchId: string, hotelName?: string): Promise<PortfolioSummary> {
  return getMockPortfolioSummary(branchId, hotelName);
}

export type { PortfolioSummary, PropertyPerformance } from "./types";
