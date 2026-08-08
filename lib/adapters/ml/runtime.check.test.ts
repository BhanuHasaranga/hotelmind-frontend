import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Guards the whole point of the mock mode: on live, no ML entry point may
 * reach the network. The stub resolves (rather than rejects) so a leak is
 * reported as a failed assertion instead of crashing the run.
 *
 * Mock mode is forced here rather than inherited from the ambient env — under
 * a plain `vitest run` NODE_ENV is "test", which correctly resolves to the
 * real path, and the capability registry reads env at module-load time.
 */
vi.stubEnv("NEXT_PUBLIC_ML_MODE", "mock");
const calls: string[] = [];
vi.stubGlobal(
  "fetch",
  vi.fn((url: string) => {
    calls.push(String(url));
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(""),
    } as unknown as Response);
  }),
);

describe("mock mode issues zero ML network calls", () => {
  beforeEach(() => {
    calls.length = 0;
  });

  it("no ML entry point touches fetch", async () => {
    const ml = await import("@/lib/adapters/ml");
    const t = "tok";

    await Promise.all([
      ml.recommendPricing(t, { branch_id: "b", room_type_id: "r", date: "2026-08-09",
        current_occupancy_pct: 70, current_revenue: 4000, revenue_7day_avg: 3800, total_rooms: 40 }),
      ml.forecastOccupancy(t, { branch_id: "b", horizon_days: 7 }),
      ml.forecastRestaurantDemand(t, { branch_id: "b", date: "2026-08-09",
        recent_total_orders_lag_1: 30, recent_total_orders_lag_7: 28,
        recent_total_orders_rolling_mean_7: 32, avg_item_value: 20 }),
      ml.recommendStaffRequirements(t, { branch_id: "b", department: "Housekeeping",
        date: "2026-08-09", scheduled_employees: 8, present_employees_lag_7: 9,
        present_employees_rolling_mean_7: 9 }),
      ml.predictChurn(t, "guest-1"),
      ml.queryAssistant(t, "What's our current occupancy forecast?"),
      ml.getReviewsSummary(t),
      ml.getReviewsTopics(t),
      ml.getReviewsComplaints(t),
      ml.getReviewsTrends(t),
      ml.getInsights(t),
      ml.getExecutiveInsights(t),
      ml.listRecommendations(t, "b", "PRICING"),
      ml.actOnRecommendation(t, "mock-pricing-x", { status: "ACCEPTED" }),
    ]);

    expect(calls).toEqual([]);
  });
});
