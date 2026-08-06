import { EmptyState } from "@/components/ui/EmptyState";

export interface DepartmentStaffingRow {
  departmentId: string;
  departmentName: string;
  scheduledEmployees: number;
  requiredStaff: number | null;
}

interface ScheduleCalendarProps {
  rows: DepartmentStaffingRow[];
}

/**
 * A true per-employee shift calendar would need one /staff/schedules call
 * per employee (the backend endpoint is employee-scoped, not branch-scoped —
 * see app/routers/staff.py), which doesn't scale to a branch-wide view. This
 * renders the department-level scheduled-vs-recommended comparison instead,
 * which is the actual staffing gap a real Ops Manager needs at a glance.
 */
export function ScheduleCalendar({ rows }: ScheduleCalendarProps) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon="staffing"
        title="No departments yet"
        description="Add departments and employees to see staffing coverage."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Department
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Scheduled
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recommended
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Coverage
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => {
            const ratio =
              row.requiredStaff && row.requiredStaff > 0
                ? Math.min(row.scheduledEmployees / row.requiredStaff, 1.5)
                : null;
            return (
              <tr key={row.departmentId}>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{row.departmentName}</td>
                <td className="px-4 py-3 text-sm text-foreground">{row.scheduledEmployees}</td>
                <td className="px-4 py-3 text-sm text-foreground">{row.requiredStaff ?? "—"}</td>
                <td className="px-4 py-3">
                  {ratio !== null ? (
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={ratio < 1 ? "h-full bg-amber-500" : "h-full bg-emerald-500"}
                        style={{ width: `${Math.min(ratio, 1) * 100}%` }}
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not requested</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
