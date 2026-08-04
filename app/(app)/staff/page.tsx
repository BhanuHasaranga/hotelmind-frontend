import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { apiFetchAuthed } from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import type { Employee } from "@/lib/types/staff";

async function getEmployees(token: string): Promise<Employee[]> {
  try {
    return await apiFetchAuthed<Employee[]>("/api/v1/staff/employees", token);
  } catch {
    return [];
  }
}

type EmployeeRow = Employee;

const COLUMNS = [
  {
    key: "name",
    header: "Name",
    render: (e: EmployeeRow) => `${e.first_name} ${e.last_name}`,
  },
  { key: "email", header: "Email" },
  {
    key: "department",
    header: "Department",
    render: (e: EmployeeRow) => e.department?.name ?? "—",
  },
  { key: "role",     header: "Role",     render: (e: EmployeeRow) => e.role ?? "—" },
  { key: "hire_date", header: "Hired" },
  {
    key: "is_active",
    header: "Status",
    render: (e: EmployeeRow) => <Badge label={e.is_active ? "AVAILABLE" : "OCCUPIED"} />,
  },
];

export default async function StaffPage() {
  const session = await getSession();
  const employees = session ? await getEmployees(session.token) : [];

  return (
    <>
      <TopBar title="Staff" subtitle="Employees and scheduling" />

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Total Employees", value: employees.length,                                   color: "text-blue-600" },
            { label: "Active",          value: employees.filter((e) => e.is_active).length,        color: "text-green-600" },
            { label: "Inactive",        value: employees.filter((e) => !e.is_active).length,       color: "text-gray-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm">
              <p className="text-xs text-gray-400">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <DataTable<EmployeeRow>
          columns={COLUMNS as never}
          data={employees}
          keyExtractor={(e) => e.id}
          emptyMessage="No employees yet. Add one via POST /api/v1/staff/employees"
        />
      </div>
    </>
  );
}
