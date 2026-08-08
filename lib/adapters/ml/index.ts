import { isMocked } from "../config";
import * as real from "@/lib/api/ml";
import * as mock from "./mock";
import type {
  ChurnPredictResponse,
  InsightItem,
  OccupancyForecastRequest,
  OccupancyForecastResponse,
  PricingRecommendRequest,
  PricingRecommendResponse,
  RagQueryResponse,
  Recommendation,
  RecommendationActionRequest,
  RecommendationType,
  RestaurantDemandRequest,
  RestaurantDemandResponse,
  ReviewsComplaintsResponse,
  ReviewsSummaryResponse,
  ReviewsTopicsResponse,
  ReviewsTrendsResponse,
  StaffRequirementRequest,
  StaffRequirementResponse,
} from "./types";

/**
 * Single entry point for everything in lib/api/ml.ts.
 *
 * The prediction endpoints branch on the ML capabilities in
 * lib/adapters/config.ts: "real" (local/dev) calls hotelmind-ml through the
 * backend, "mock" (live) serves deterministic demo data — the production box
 * cannot run inference (see ML_SERVER_ISSUES.md). Signatures match the real
 * module exactly, so call sites only change their import path.
 *
 * The guardrail and recommendation functions are NOT ML — they hit plain
 * Postgres routers — and are re-exported unchanged, except where a mocked
 * prediction's synthetic id would 404 against the real table (see below).
 */

// ── ML predictions ────────────────────────────────────────────────────────

export function recommendPricing(
  token: string,
  body: PricingRecommendRequest,
): Promise<PricingRecommendResponse> {
  if (isMocked("pricing")) return mock.mockRecommendPricing(body);
  return real.recommendPricing(token, body);
}

export function forecastOccupancy(
  token: string,
  body: OccupancyForecastRequest,
): Promise<OccupancyForecastResponse> {
  if (isMocked("occupancyForecast")) return mock.mockForecastOccupancy(body);
  return real.forecastOccupancy(token, body);
}

export function forecastRestaurantDemand(
  token: string,
  body: RestaurantDemandRequest,
): Promise<RestaurantDemandResponse> {
  if (isMocked("restaurantDemand")) return mock.mockForecastRestaurantDemand(body);
  return real.forecastRestaurantDemand(token, body);
}

export function recommendStaffRequirements(
  token: string,
  body: StaffRequirementRequest,
): Promise<StaffRequirementResponse> {
  if (isMocked("staffingForecast")) return mock.mockRecommendStaffRequirements(body);
  return real.recommendStaffRequirements(token, body);
}

export function predictChurn(token: string, guestId: string): Promise<ChurnPredictResponse> {
  if (isMocked("guestChurn")) return mock.mockPredictChurn(guestId);
  return real.predictChurn(token, guestId);
}

export function queryAssistant(
  token: string,
  query: string,
  persona = "hotel_analyst",
  sessionId?: string,
): Promise<RagQueryResponse> {
  if (isMocked("aiAssistant")) return mock.mockQueryAssistant(query);
  return real.queryAssistant(token, query, persona, sessionId);
}

// ── Reviews / sentiment ───────────────────────────────────────────────────

export function getReviewsSummary(token: string): Promise<ReviewsSummaryResponse> {
  if (isMocked("guestSentiment")) return mock.mockGetReviewsSummary();
  return real.getReviewsSummary(token);
}

export function getReviewsTopics(token: string): Promise<ReviewsTopicsResponse> {
  if (isMocked("guestSentiment")) return mock.mockGetReviewsTopics();
  return real.getReviewsTopics(token);
}

export function getReviewsComplaints(token: string): Promise<ReviewsComplaintsResponse> {
  if (isMocked("guestSentiment")) return mock.mockGetReviewsComplaints();
  return real.getReviewsComplaints(token);
}

export function getReviewsTrends(
  token: string,
  grain: "daily" | "weekly" | "monthly" = "weekly",
): Promise<ReviewsTrendsResponse> {
  if (isMocked("guestSentiment")) return mock.mockGetReviewsTrends(grain);
  return real.getReviewsTrends(token, grain);
}

// ── Insights ──────────────────────────────────────────────────────────────

export function getInsights(
  token: string,
  category?: string,
  minSeverity?: string,
): Promise<{ insights: InsightItem[] }> {
  if (isMocked("aiAssistant")) return mock.mockGetInsights();
  return real.getInsights(token, category, minSeverity);
}

export function getExecutiveInsights(
  token: string,
): Promise<{ narrative: string; top_findings: InsightItem[] }> {
  if (isMocked("aiAssistant")) return mock.mockGetExecutiveInsights();
  return real.getExecutiveInsights(token);
}

// ── Closed-loop recommendations (DB-backed, but coupled to mocked ids) ────

export function listRecommendations(
  token: string,
  branchId: string,
  type?: RecommendationType,
  status?: string,
): Promise<Recommendation[]> {
  // The real table only ever holds rows written by real predictions, so in
  // mock mode it would render an empty history next to live-looking cards.
  if (isMocked("pricing")) return mock.mockListRecommendations(branchId, type);
  return real.listRecommendations(token, branchId, type, status);
}

export function actOnRecommendation(
  token: string,
  recommendationId: string,
  body: RecommendationActionRequest,
): Promise<Recommendation> {
  // Synthetic ids from mocked predictions would 404 against the real router.
  if (recommendationId.startsWith("mock-")) {
    return mock.mockActOnRecommendation(recommendationId, body.status, body.applied_value);
  }
  return real.actOnRecommendation(token, recommendationId, body);
}

export function measureOutcome(token: string, recommendationId: string) {
  if (recommendationId.startsWith("mock-")) return mock.mockMeasureOutcome(recommendationId);
  return real.measureOutcome(token, recommendationId);
}

// ── Guardrails (plain Postgres, never mocked) ────────────────────────────

export {
  deletePricingGuardrail,
  listPricingGuardrails,
  listStaffingGuardrails,
  upsertPricingGuardrail,
  upsertStaffingGuardrail,
} from "@/lib/api/ml";
