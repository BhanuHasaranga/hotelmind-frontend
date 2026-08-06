import { getHrSummary as getMockHrSummary } from "./mock";
import type { HrSummary } from "./types";

/**
 * hrPayroll is "mock" in the capability registry (lib/adapters/config.ts) —
 * hotelmind-backend has no payroll or leave-management module. Once it
 * does, branch on CAPABILITIES.hrPayroll here; the page consuming this
 * function does not need to change.
 */
export async function getHrSummary(branchId: string): Promise<HrSummary> {
  return getMockHrSummary(branchId);
}

export type { HrSummary, PayrollRow, LeaveRequest, LeaveStatus } from "./types";
