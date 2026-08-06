/**
 * Central capability registry.
 *
 * Every domain the frontend renders is tagged "real" (backed by the live
 * hotelmind-backend API) or "mock" (backend has no such capability yet —
 * served by a deterministic seeded generator under lib/adapters/<domain>).
 *
 * Flip a key to "real" once the backend ships the matching endpoint; no
 * page/component code should need to change, only the domain's index.ts.
 */
export const CAPABILITIES = {
  bookings: "real",
  rooms: "real",
  pricing: "real",
  occupancyForecast: "real",
  restaurantDemand: "real",
  staffingForecast: "real",
  guestSentiment: "real",
  aiAssistant: "real",
  hotels: "real",
  staff: "real",
  restaurant: "real",

  housekeeping: "mock",
  maintenance: "mock",
  frontDesk: "mock",
  loyalty: "mock",
  portfolioRollup: "mock",
  adminConsole: "mock",
  hrPayroll: "mock",
  dashboardWeather: "mock",
  dashboardEvents: "mock",
  dashboardAIInsights: "mock",
  dashboardStaffUtilization: "mock",
  dashboardFoodWaste: "mock",
} as const satisfies Record<string, "real" | "mock">;

export type Capability = keyof typeof CAPABILITIES;
export type CapabilitySource = (typeof CAPABILITIES)[Capability];

export function isMocked(capability: Capability): boolean {
  return CAPABILITIES[capability] === "mock";
}
