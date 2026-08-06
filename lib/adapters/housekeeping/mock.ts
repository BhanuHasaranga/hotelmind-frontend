import { seededRandom, pick, range, dailySeedKey } from "../seed";
import type { HousekeepingStatus, HousekeepingSummary, HousekeepingTask } from "./types";

const STATUSES: HousekeepingStatus[] = ["DIRTY", "IN_PROGRESS", "INSPECTED", "CLEAN"];
const PRIORITIES = ["LOW", "NORMAL", "HIGH"] as const;
const STAFF = ["M. Alvarez", "T. Nakamura", "S. Osei", "J. Petrov", null];

export function getHousekeepingSummary(branchId: string): HousekeepingSummary {
  const rand = seededRandom(dailySeedKey(branchId, "housekeeping"));
  const taskCount = range(rand, 18, 36);

  const tasks: HousekeepingTask[] = Array.from({ length: taskCount }, (_, i) => {
    const floor = range(rand, 1, 6);
    const status = pick(rand, STATUSES);
    return {
      id: `hk-${i}`,
      roomNumber: `${floor}${String(range(rand, 1, 24)).padStart(2, "0")}`,
      floor,
      status,
      priority: pick(rand, PRIORITIES),
      assignedTo: status === "DIRTY" ? null : pick(rand, STAFF),
      estimatedMinutes: range(rand, 15, 55),
      lastUpdated: new Date(Date.now() - range(rand, 0, 240) * 60_000).toISOString(),
    };
  });

  const counts = STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status).length;
      return acc;
    },
    {} as Record<HousekeepingStatus, number>,
  );

  return {
    tasks,
    counts,
    avgTurnaroundMinutes: range(rand, 24, 42),
  };
}
