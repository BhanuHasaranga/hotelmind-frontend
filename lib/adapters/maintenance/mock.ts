import { seededRandom, pick, range, dailySeedKey } from "../seed";
import type { MaintenanceStatus, MaintenanceSummary, MaintenanceTicket, MaintenanceCategory, MaintenancePriority } from "./types";

const STATUSES: MaintenanceStatus[] = ["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED"];
const CATEGORIES: MaintenanceCategory[] = ["ELECTRICAL", "PLUMBING", "HVAC", "FURNITURE", "IT", "OTHER"];
const PRIORITIES: MaintenancePriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const STAFF = ["R. Costa", "A. Iqbal", "D. Fenwick", null];
const LOCATIONS = ["Room", "Lobby", "Pool Area", "Kitchen", "Parking Garage", "Rooftop Bar"];

export function getMaintenanceSummary(branchId: string): MaintenanceSummary {
  const rand = seededRandom(dailySeedKey(branchId, "maintenance"));
  const anchor = new Date().setHours(0, 0, 0, 0);
  const ticketCount = range(rand, 8, 22);

  const tickets: MaintenanceTicket[] = Array.from({ length: ticketCount }, (_, i) => {
    const location = pick(rand, LOCATIONS);
    const isRoom = location === "Room";
    const roomNumber = isRoom ? `${range(rand, 1, 6)}${String(range(rand, 1, 24)).padStart(2, "0")}` : null;
    return {
      id: `mt-${i}`,
      ticketNumber: `MNT-${String(1000 + i)}`,
      roomNumber,
      location: isRoom ? `Room ${roomNumber}` : location,
      category: pick(rand, CATEGORIES),
      status: pick(rand, STATUSES),
      priority: pick(rand, PRIORITIES),
      reportedBy: pick(rand, ["Front Desk", "Housekeeping", "Guest Report", "Inspection"]),
      assignedTo: pick(rand, STAFF),
      createdAt: new Date(anchor - range(rand, 1, 96) * 3_600_000).toISOString(),
      slaHours: range(rand, 4, 72),
    };
  });

  const counts = STATUSES.reduce(
    (acc, status) => {
      acc[status] = tickets.filter((t) => t.status === status).length;
      return acc;
    },
    {} as Record<MaintenanceStatus, number>,
  );

  return {
    tickets,
    counts,
    avgResolutionHours: range(rand, 6, 30),
    slaBreaches: range(rand, 0, 3),
  };
}
