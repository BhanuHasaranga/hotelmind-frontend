import { seededRandom, pick, range, dailySeedKey } from "../seed";
import type { DashboardExtras, AIInsight, LocalEvent } from "./types";

const CONDITIONS = ["sunny", "cloudy", "rain", "storm"] as const;
const EVENT_NAMES = ["City Marathon", "Tech Summit", "Music Festival", "Trade Expo", "Food & Wine Weekend"];
const INSIGHT_TEMPLATES: Array<Omit<AIInsight, "id">> = [
  { category: "revenue", severity: "warning", message: "3 rooms show elevated no-show risk this weekend based on booking-pattern similarity." },
  { category: "operational", severity: "info", message: "Restaurant demand forecast suggests a Saturday dinner spike — confirm prep staffing." },
  { category: "guest", severity: "critical", message: "2 guests currently checked in have an elevated churn-risk score from recent sentiment signals." },
  { category: "revenue", severity: "info", message: "Weekday occupancy trending 4% above the same period last month." },
  { category: "operational", severity: "warning", message: "Housekeeping turnaround time trending above target on the 3rd floor." },
];

export function getDashboardExtras(branchId: string): DashboardExtras {
  const rand = seededRandom(dailySeedKey(branchId, "dashboard-extras"));

  const events: LocalEvent[] = Array.from({ length: range(rand, 1, 3) }, (_, i) => ({
    id: `evt-${i}`,
    name: pick(rand, EVENT_NAMES),
    date: new Date(Date.now() + range(rand, 1, 10) * 86_400_000).toISOString().slice(0, 10),
    expectedDemandImpact: pick(rand, ["low", "medium", "high"] as const),
  }));

  const insightCount = range(rand, 2, 4);
  const aiInsights: AIInsight[] = Array.from({ length: insightCount }, (_, i) => ({
    id: `insight-${i}`,
    ...pick(rand, INSIGHT_TEMPLATES),
  }));

  return {
    weather: {
      condition: pick(rand, CONDITIONS),
      tempC: range(rand, 14, 32),
      summary: "Simulated forecast — not connected to a live weather provider.",
    },
    events,
    staffUtilization: {
      utilizationPct: range(rand, 68, 96),
      scheduledStaff: range(rand, 18, 32),
      requiredStaff: range(rand, 18, 32),
    },
    foodWaste: {
      wastePct: range(rand, 4, 14),
      wasteCostToday: range(rand, 40, 320),
      trend: pick(rand, ["up", "down", "flat"] as const),
    },
    maintenanceAlerts: {
      openTickets: range(rand, 0, 9),
      urgentTickets: range(rand, 0, 2),
    },
    aiInsights,
  };
}
