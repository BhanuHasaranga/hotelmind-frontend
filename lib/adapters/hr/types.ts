export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PayrollRow {
  id: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  overtimeHours: number;
  overtimePay: number;
  netPay: number;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: "ANNUAL" | "SICK" | "UNPAID";
  startDate: string;
  endDate: string;
  status: LeaveStatus;
}

export interface HrSummary {
  payroll: PayrollRow[];
  leaveRequests: LeaveRequest[];
  totalMonthlyPayroll: number;
  laborCostPct: number;
  turnoverRatePct: number;
}
