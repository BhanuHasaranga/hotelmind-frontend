export type HousekeepingStatus = "DIRTY" | "IN_PROGRESS" | "INSPECTED" | "CLEAN";
export type HousekeepingPriority = "LOW" | "NORMAL" | "HIGH";

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  floor: number;
  status: HousekeepingStatus;
  priority: HousekeepingPriority;
  assignedTo: string | null;
  estimatedMinutes: number;
  lastUpdated: string;
}

export interface HousekeepingSummary {
  tasks: HousekeepingTask[];
  counts: Record<HousekeepingStatus, number>;
  avgTurnaroundMinutes: number;
}
