import { getAdminSummary as getMockAdminSummary } from "./mock";
import type { AdminSummary } from "./types";

/**
 * adminConsole is "mock" in the capability registry (lib/adapters/config.ts)
 * — hotelmind-backend has no self-service admin UI, no audit log, and no
 * SSO/IAM beyond JWT. Once real endpoints exist, branch on
 * CAPABILITIES.adminConsole here; the page consuming this function does not
 * need to change.
 */
export async function getAdminSummary(branchId: string, branchName?: string): Promise<AdminSummary> {
  return getMockAdminSummary(branchId, branchName);
}

export type { AdminSummary, UserAccount, AuditLogEntry, SystemHealthMetric } from "./types";
