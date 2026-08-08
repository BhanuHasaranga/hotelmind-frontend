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

/**
 * Every capability backed by the ML service (hotelmind-ml, proxied through
 * the backend's /api/v1/ml/* routes) is gated on this one switch.
 *
 * The production box is CPU-only with a 512MB ml-backend container, so real
 * inference there 502s (see ML_SERVER_ISSUES.md) and there is no budget to
 * fix that for a portfolio demo. Live therefore serves deterministic mock
 * data from lib/adapters/ml, while local/dev keeps calling the real models.
 *
 * Set NEXT_PUBLIC_ML_MODE explicitly to override the NODE_ENV default in
 * either direction (e.g. to preview the mock data locally).
 */
const ML_MODE: "real" | "mock" =
  process.env.NEXT_PUBLIC_ML_MODE === "mock"
    ? "mock"
    : process.env.NEXT_PUBLIC_ML_MODE === "real"
      ? "real"
      : process.env.NODE_ENV === "production"
        ? "mock"
        : "real";

export const CAPABILITIES = {
  bookings: "real",
  rooms: "real",
  pricing: ML_MODE,
  occupancyForecast: ML_MODE,
  restaurantDemand: ML_MODE,
  staffingForecast: ML_MODE,
  guestSentiment: ML_MODE,
  guestChurn: ML_MODE,
  aiAssistant: ML_MODE,
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
