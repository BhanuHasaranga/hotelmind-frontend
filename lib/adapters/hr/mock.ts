import { seededRandom, pick, range, dailySeedKey } from "../seed";
import type { HrSummary, LeaveRequest, LeaveStatus, PayrollRow } from "./types";

const DEPARTMENTS = ["Front Office", "Housekeeping", "Restaurant", "Maintenance", "Revenue", "Kitchen"];
const FIRST_NAMES = ["Amara", "Kenji", "Sofia", "Lucas", "Priya", "Mateo", "Elena", "Noah", "Fatima", "Owen"];
const LAST_NAMES = ["Silva", "Nakata", "Rossi", "Kim", "Patel", "Novak", "Bauer", "Diallo", "Chen", "Foster"];
const LEAVE_TYPES = ["ANNUAL", "SICK", "UNPAID"] as const;
const LEAVE_STATUSES: LeaveStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export function getHrSummary(branchId: string): HrSummary {
  const rand = seededRandom(dailySeedKey(branchId, "hr"));
  const employeeCount = range(rand, 16, 30);

  const payroll: PayrollRow[] = Array.from({ length: employeeCount }, (_, i) => {
    const baseSalary = range(rand, 2200, 6800);
    const overtimeHours = range(rand, 0, 18);
    const overtimePay = Math.round(overtimeHours * (baseSalary / 160) * 1.5);
    return {
      id: `hr-${i}`,
      employeeName: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
      department: pick(rand, DEPARTMENTS),
      baseSalary,
      overtimeHours,
      overtimePay,
      netPay: baseSalary + overtimePay,
    };
  });

  const leaveRequests: LeaveRequest[] = Array.from({ length: range(rand, 3, 9) }, (_, i) => {
    const start = range(rand, 1, 30);
    return {
      id: `leave-${i}`,
      employeeName: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
      type: pick(rand, LEAVE_TYPES),
      startDate: new Date(Date.now() + start * 86_400_000).toISOString().slice(0, 10),
      endDate: new Date(Date.now() + (start + range(rand, 1, 5)) * 86_400_000).toISOString().slice(0, 10),
      status: pick(rand, LEAVE_STATUSES),
    };
  });

  return {
    payroll,
    leaveRequests,
    totalMonthlyPayroll: payroll.reduce((sum, p) => sum + p.netPay, 0),
    laborCostPct: range(rand, 24, 34),
    turnoverRatePct: range(rand, 4, 18),
  };
}
