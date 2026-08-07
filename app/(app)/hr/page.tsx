import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Sparkles } from "lucide-react";
import { getActiveBranch } from "@/lib/auth/branch";
import { getHrSummary } from "@/lib/adapters/hr";
import type { PayrollRow, LeaveRequest } from "@/lib/adapters/hr";

const LEAVE_VARIANT = { PENDING: "warning", APPROVED: "success", REJECTED: "danger" } as const;

const PAYROLL_COLUMNS = [
  { key: "employeeName", header: "Employee" },
  { key: "department", header: "Department" },
  { key: "baseSalary", header: "Base Salary", render: (r: PayrollRow) => `$${r.baseSalary.toLocaleString()}` },
  { key: "overtimeHours", header: "OT Hours" },
  { key: "overtimePay", header: "OT Pay", render: (r: PayrollRow) => `$${r.overtimePay.toLocaleString()}` },
  { key: "netPay", header: "Net Pay", render: (r: PayrollRow) => `$${r.netPay.toLocaleString()}` },
];

const LEAVE_COLUMNS = [
  { key: "employeeName", header: "Employee" },
  { key: "type", header: "Type" },
  { key: "startDate", header: "Start" },
  { key: "endDate", header: "End" },
  { key: "status", header: "Status", render: (r: LeaveRequest) => <Badge label={r.status} variant={LEAVE_VARIANT[r.status]} /> },
];

export default async function HrPage() {
  const active = await getActiveBranch();
  const summary = active?.branchId ? await getHrSummary(active.branchId) : null;

  return (
    <>
      <TopBar title="HR & Payroll" subtitle="Payroll, leave requests and workforce metrics" dataSource="mock" />

      <div className="mt-6 space-y-6">
        <Alert variant="preview" icon={<Sparkles className="h-4 w-4" />} title="Preview module">
          hotelmind-backend has no payroll or leave-management module yet — this screen is a fully-designed preview
          backed by simulated data (lib/adapters/hr).
        </Alert>

        {summary && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Monthly Payroll" value={`$${summary.totalMonthlyPayroll.toLocaleString()}`} icon="revenue" accent="success" />
              <StatCard label="Labor Cost %" value={`${summary.laborCostPct}%`} icon="reports" accent="brand" />
              <StatCard label="Turnover Rate" value={`${summary.turnoverRatePct}%`} icon="staff" accent="warning" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <DataTable<LeaveRequest>
                  columns={LEAVE_COLUMNS as never}
                  data={summary.leaveRequests}
                  keyExtractor={(r) => r.id}
                  emptyMessage="No pending leave requests."
                  className="border-0 shadow-none"
                />
              </CardContent>
            </Card>

            <DataTable<PayrollRow>
              columns={PAYROLL_COLUMNS as never}
              data={summary.payroll}
              keyExtractor={(r) => r.id}
              emptyMessage="No payroll records."
            />
          </>
        )}
      </div>
    </>
  );
}
