export type MaintenanceStatus = "OPEN" | "IN_PROGRESS" | "ON_HOLD" | "RESOLVED";
export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type MaintenanceCategory = "ELECTRICAL" | "PLUMBING" | "HVAC" | "FURNITURE" | "IT" | "OTHER";

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  roomNumber: string | null;
  location: string;
  category: MaintenanceCategory;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  reportedBy: string;
  assignedTo: string | null;
  createdAt: string;
  slaHours: number;
}

export interface MaintenanceSummary {
  tickets: MaintenanceTicket[];
  counts: Record<MaintenanceStatus, number>;
  avgResolutionHours: number;
  slaBreaches: number;
}
