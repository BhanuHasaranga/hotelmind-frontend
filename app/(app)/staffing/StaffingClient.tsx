"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/ToastProvider";
import { StaffRequirementCard } from "@/components/staffing/StaffRequirementCard";
import { ScheduleCalendar, type DepartmentStaffingRow } from "@/components/staffing/ScheduleCalendar";
import { actOnRecommendation, recommendStaffRequirements } from "@/lib/api/ml";
import type { Department, Employee } from "@/lib/types/staff";
import type { StaffRequirementResponse } from "@/lib/types/ml";

interface StaffingClientProps {
  token: string;
  branchId: string;
  departments: Department[];
  employees: Employee[];
}

export function StaffingClient({ token, branchId, departments, employees }: StaffingClientProps) {
  const { toast } = useToast();
  const [requirements, setRequirements] = useState<Record<string, StaffRequirementResponse>>({});
  const [loadingDept, setLoadingDept] = useState<string | null>(null);

  const scheduledByDept = departments.map((dept) => ({
    dept,
    scheduled: employees.filter((e) => e.department_id === dept.id && e.is_active).length,
  }));

  async function handleRequest(dept: Department, scheduled: number) {
    setLoadingDept(dept.id);
    try {
      const result = await recommendStaffRequirements(token, {
        branch_id: branchId,
        department: dept.name,
        date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        scheduled_employees: scheduled,
        present_employees_lag_7: scheduled,
        present_employees_rolling_mean_7: scheduled,
      });
      setRequirements((prev) => ({ ...prev, [dept.id]: result }));
    } catch (err) {
      toast({
        title: "Could not get staffing recommendation",
        description: err instanceof Error ? err.message : "The ML service may be unavailable.",
        variant: "danger",
      });
    } finally {
      setLoadingDept(null);
    }
  }

  async function handleAction(deptId: string, status: "ACCEPTED" | "DISMISSED") {
    const requirement = requirements[deptId];
    if (!requirement) return;
    await actOnRecommendation(token, requirement.recommendation_id, { status });
    setRequirements((prev) => {
      const next = { ...prev };
      delete next[deptId];
      return next;
    });
  }

  const calendarRows: DepartmentStaffingRow[] = scheduledByDept.map(({ dept, scheduled }) => ({
    departmentId: dept.id,
    departmentName: dept.name,
    scheduledEmployees: scheduled,
    requiredStaff: requirements[dept.id]?.required_staff ?? null,
  }));

  if (departments.length === 0) {
    return (
      <EmptyState
        icon="staffing"
        title="No departments found"
        description="Add departments to this branch to see staffing recommendations."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scheduledByDept.map(({ dept, scheduled }) => {
          const requirement = requirements[dept.id];
          if (requirement) {
            return (
              <StaffRequirementCard
                key={dept.id}
                departmentName={dept.name}
                scheduledEmployees={scheduled}
                requirement={requirement}
                onAccept={() => handleAction(dept.id, "ACCEPTED")}
                onDismiss={() => handleAction(dept.id, "DISMISSED")}
              />
            );
          }
          return (
            <Card key={dept.id}>
              <CardHeader>
                <CardTitle>{dept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{scheduled}</p>
                <p className="mb-3 text-xs text-muted-foreground">Currently scheduled</p>
                <button
                  onClick={() => handleRequest(dept, scheduled)}
                  disabled={loadingDept === dept.id}
                  className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                >
                  {loadingDept === dept.id ? "Requesting…" : "Get recommendation"}
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coverage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleCalendar rows={calendarRows} />
        </CardContent>
      </Card>
    </div>
  );
}
