import { seededRandom, pick, range, dailySeedKey } from "../seed";
import type { AdminSummary, AuditLogEntry, SystemHealthMetric, UserAccount } from "./types";

const ROLES = ["OWNER", "REVENUE_MANAGER", "OPS_MANAGER", "RESTAURANT_MANAGER", "GUEST_EXPERIENCE_MANAGER"];
const FIRST_NAMES = ["Amara", "Kenji", "Sofia", "Lucas", "Priya", "Mateo", "Elena", "Noah"];
const LAST_NAMES = ["Silva", "Nakata", "Rossi", "Kim", "Patel", "Novak", "Bauer", "Diallo"];
const STATUSES = ["ACTIVE", "SUSPENDED", "INVITED"] as const;
const ACTIONS = ["Approved refund", "Overrode rate recommendation", "Updated room status", "Invited user", "Changed role", "Exported report"];

export function getAdminSummary(branchId: string, branchName = "Main Branch"): AdminSummary {
  const rand = seededRandom(dailySeedKey(branchId, "admin"));
  const anchor = new Date().setHours(0, 0, 0, 0);

  const users: UserAccount[] = Array.from({ length: range(rand, 8, 16) }, (_, i) => ({
    id: `usr-${i}`,
    fullName: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
    email: `user${i}@hotelmind.example`,
    role: pick(rand, ROLES),
    branchName,
    status: pick(rand, STATUSES),
    lastLogin: rand() > 0.15 ? new Date(anchor - range(rand, 0, 30) * 86_400_000).toISOString() : null,
  }));

  const auditLog: AuditLogEntry[] = Array.from({ length: range(rand, 10, 20) }, (_, i) => ({
    id: `audit-${i}`,
    actor: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
    action: pick(rand, ACTIONS),
    target: `#${range(rand, 1000, 9999)}`,
    timestamp: new Date(anchor - range(rand, 0, 72) * 3_600_000).toISOString(),
  }));

  const systemHealth: SystemHealthMetric[] = [
    { label: "API Uptime (30d)", value: `${(99 + rand() * 0.9).toFixed(2)}%`, status: "healthy" },
    { label: "WebSocket Connections", value: `${range(rand, 12, 80)} active`, status: "healthy" },
    { label: "ML Inference Latency (p95)", value: `${range(rand, 180, 640)}ms`, status: rand() > 0.8 ? "degraded" : "healthy" },
    { label: "Data Warehouse Sync", value: rand() > 0.9 ? "Delayed" : "On schedule", status: rand() > 0.9 ? "degraded" : "healthy" },
  ];

  return { users, auditLog, systemHealth };
}
