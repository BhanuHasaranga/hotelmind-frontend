import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Sparkles } from "lucide-react";
import { getActiveBranch } from "@/lib/auth/branch";
import { getAdminSummary } from "@/lib/adapters/admin";
import type { UserAccount, AuditLogEntry } from "@/lib/adapters/admin";

const STATUS_VARIANT = { ACTIVE: "success", SUSPENDED: "danger", INVITED: "warning" } as const;
const HEALTH_VARIANT = { healthy: "success", degraded: "warning", down: "danger" } as const;

const USER_COLUMNS = [
  { key: "fullName", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
  { key: "branchName", header: "Branch" },
  { key: "status", header: "Status", render: (r: UserAccount) => <Badge label={r.status} variant={STATUS_VARIANT[r.status]} /> },
  { key: "lastLogin", header: "Last Login", render: (r: UserAccount) => (r.lastLogin ? new Date(r.lastLogin).toLocaleDateString() : "Never") },
];

const AUDIT_COLUMNS = [
  { key: "timestamp", header: "When", render: (r: AuditLogEntry) => new Date(r.timestamp).toLocaleString() },
  { key: "actor", header: "User" },
  { key: "action", header: "Action" },
  { key: "target", header: "Target" },
];

export default async function AdminPage() {
  const active = await getActiveBranch();
  const summary = active?.branchId ? await getAdminSummary(active.branchId) : null;

  return (
    <>
      <TopBar title="Administration" subtitle="Users, audit log and system health" dataSource="mock" />

      <div className="mt-6 space-y-6">
        <Alert variant="mock" icon={<Sparkles className="h-4 w-4" />} title="Preview module">
          hotelmind-backend has no self-service admin console, audit trail, or SSO/IAM beyond JWT yet — this screen
          is a fully-designed preview backed by simulated data (lib/adapters/admin), scoped to OWNER sessions.
        </Alert>

        {summary && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-4">
                {summary.systemHealth.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-lg font-bold text-foreground">{metric.value}</p>
                      <Badge label={metric.status} variant={HEALTH_VARIANT[metric.status]} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <DataTable<UserAccount>
                  columns={USER_COLUMNS as never}
                  data={summary.users}
                  keyExtractor={(r) => r.id}
                  emptyMessage="No users found."
                  className="border-0 shadow-none"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <DataTable<AuditLogEntry>
                  columns={AUDIT_COLUMNS as never}
                  data={summary.auditLog}
                  keyExtractor={(r) => r.id}
                  emptyMessage="No audit entries."
                  className="border-0 shadow-none"
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
