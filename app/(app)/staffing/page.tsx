import { TopBar } from "@/components/layout/TopBar";
import { StaffingClient } from "./StaffingClient";
import { apiFetchAuthed } from "@/lib/api";
import { getActiveBranch } from "@/lib/auth/branch";
import type { Department, Employee } from "@/lib/types/staff";

async function getDepartments(branchId: string, token: string): Promise<Department[]> {
  try {
    return await apiFetchAuthed<Department[]>(`/api/v1/staff/departments?branch_id=${branchId}`, token);
  } catch {
    return [];
  }
}

async function getEmployees(token: string): Promise<Employee[]> {
  try {
    return await apiFetchAuthed<Employee[]>("/api/v1/staff/employees", token);
  } catch {
    return [];
  }
}

export default async function StaffingPage() {
  const active = await getActiveBranch();

  if (!active?.branchId) {
    return (
      <>
        <TopBar title="Staffing" subtitle="AI-recommended headcount" />
        <p className="mt-6 text-sm text-muted-foreground">
          Select a branch from the switcher above to view staffing recommendations.
        </p>
      </>
    );
  }

  const { branchId, session } = active;
  const [departments, employees] = await Promise.all([
    getDepartments(branchId, session.token),
    getEmployees(session.token),
  ]);

  return (
    <>
      <TopBar title="Staffing" subtitle="AI-recommended headcount by department" dataSource="beta" />
      <div className="mt-6">
        <StaffingClient
          token={session.token}
          branchId={branchId}
          departments={departments}
          employees={employees}
        />
      </div>
    </>
  );
}
