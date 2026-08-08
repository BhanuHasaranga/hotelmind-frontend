import { describe, it, expect } from "vitest";
import * as mock from "@/lib/adapters/ml/mock";

describe("ml mock shapes", () => {
  it("occupancy forecast honors horizon + CI bands", async () => {
    const r = await mock.mockForecastOccupancy({ branch_id: "b1", horizon_days: 14 });
    expect(r.forecast).toHaveLength(14);
    for (const d of r.forecast) {
      expect(d.ci_lower).toBeLessThanOrEqual(d.predicted_occupancy_pct);
      expect(d.ci_upper).toBeGreaterThanOrEqual(d.predicted_occupancy_pct);
      expect(d.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("pricing is deterministic and positive", async () => {
    const body = { branch_id: "b1", room_type_id: "rt1", date: "2026-08-09",
      current_occupancy_pct: 72, current_revenue: 4200, revenue_7day_avg: 3900, total_rooms: 40 };
    const a = await mock.mockRecommendPricing(body);
    const b = await mock.mockRecommendPricing(body);
    expect(a.recommended_price).toBe(b.recommended_price);
    expect(a.recommended_price).toBeGreaterThan(0);
  });

  it("churn is stable per guest", async () => {
    const a = await mock.mockPredictChurn("g-123");
    const b = await mock.mockPredictChurn("g-123");
    expect(a.churn_probability).toBe(b.churn_probability);
    expect(["LOW","MEDIUM","HIGH"]).toContain(a.risk_level);
  });

  it("trends series has the keys SentimentTrendChart looks for", async () => {
    const r = await mock.mockGetReviewsTrends("weekly");
    expect(r.series.length).toBeGreaterThan(0);
    expect(r.series[0]).toHaveProperty("period");
    expect(typeof r.series[0].avg_sentiment_score).toBe("number");
  });

  it("topics/complaints have the keys their components read", async () => {
    const t = await mock.mockGetReviewsTopics();
    expect(typeof t.topics[0].topic).toBe("string");
    expect(typeof t.topics[0].count).toBe("number");
    const c = await mock.mockGetReviewsComplaints();
    expect(typeof c.complaints[0].comment).toBe("string");
    expect(typeof c.complaints[0].guest_id).toBe("string");
  });

  it("assistant answers suggested prompts and falls back gracefully", async () => {
    const hit = await mock.mockQueryAssistant("What's our current occupancy forecast?");
    expect(hit.used_llm).toBe(true);
    expect(hit.citations.length).toBeGreaterThan(0);
    const miss = await mock.mockQueryAssistant("what is the airspeed of a swallow");
    expect(miss.used_llm).toBe(false);
    expect(miss.answer).toContain("scripted");
  });

  it("recommendation history rows carry a price the table can render", async () => {
    const rows = await mock.mockListRecommendations("b1", "PRICING");
    expect(rows.length).toBeGreaterThan(0);
    expect(typeof rows[0].payload.recommended_price).toBe("number");
    expect(rows[0].id.startsWith("mock-")).toBe(true);
  });
});
