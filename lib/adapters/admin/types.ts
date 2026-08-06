export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: string;
  branchName: string;
  status: "ACTIVE" | "SUSPENDED" | "INVITED";
  lastLogin: string | null;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SystemHealthMetric {
  label: string;
  value: string;
  status: "healthy" | "degraded" | "down";
}

export interface AdminSummary {
  users: UserAccount[];
  auditLog: AuditLogEntry[];
  systemHealth: SystemHealthMetric[];
}
