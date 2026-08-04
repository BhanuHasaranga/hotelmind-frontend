import { apiFetchAuthed } from "@/lib/api";
import type {
  ChurnPredictResponse,
  InsightItem,
  OccupancyForecastRequest,
  OccupancyForecastResponse,
  PricingGuardrail,
  PricingGuardrailInput,
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
  StaffingGuardrail,
  StaffingGuardrailInput,
  StaffRequirementRequest,
  StaffRequirementResponse,
} from "@/lib/types/ml";

export function recommendPricing(token: string, body: PricingRecommendRequest) {
  return apiFetchAuthed<PricingRecommendResponse>("/api/v1/ml/pricing/recommend", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function forecastOccupancy(token: string, body: OccupancyForecastRequest) {
  return apiFetchAuthed<OccupancyForecastResponse>("/api/v1/ml/occupancy/forecast", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function forecastRestaurantDemand(token: string, body: RestaurantDemandRequest) {
  return apiFetchAuthed<RestaurantDemandResponse>("/api/v1/ml/restaurant/demand", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function recommendStaffRequirements(token: string, body: StaffRequirementRequest) {
  return apiFetchAuthed<StaffRequirementResponse>("/api/v1/ml/staff/requirements", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function predictChurn(token: string, guestId: string) {
  return apiFetchAuthed<ChurnPredictResponse>("/api/v1/ml/churn/predict", token, {
    method: "POST",
    body: JSON.stringify({ guest_id: guestId }),
  });
}

export function queryAssistant(
  token: string,
  query: string,
  persona = "hotel_analyst",
  sessionId?: string,
) {
  return apiFetchAuthed<RagQueryResponse>("/api/v1/ml/rag/query", token, {
    method: "POST",
    body: JSON.stringify({ query, persona, session_id: sessionId }),
  });
}

export function getInsights(token: string, category?: string, minSeverity?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (minSeverity) params.set("min_severity", minSeverity);
  const qs = params.toString();
  return apiFetchAuthed<{ insights: InsightItem[] }>(
    `/api/v1/ml/insights${qs ? `?${qs}` : ""}`,
    token,
  );
}

export function getExecutiveInsights(token: string) {
  return apiFetchAuthed<{ narrative: string; top_findings: InsightItem[] }>(
    "/api/v1/ml/insights/executive",
    token,
  );
}

export function getReviewsSummary(token: string) {
  return apiFetchAuthed<ReviewsSummaryResponse>("/api/v1/ml/reviews/summary", token);
}

export function getReviewsTopics(token: string) {
  return apiFetchAuthed<ReviewsTopicsResponse>("/api/v1/ml/reviews/topics", token);
}

export function getReviewsComplaints(token: string) {
  return apiFetchAuthed<ReviewsComplaintsResponse>("/api/v1/ml/reviews/complaints", token);
}

export function getReviewsTrends(token: string, grain: "daily" | "weekly" | "monthly" = "weekly") {
  return apiFetchAuthed<ReviewsTrendsResponse>(`/api/v1/ml/reviews/trends?grain=${grain}`, token);
}

// ── Closed-loop recommendations ──────────────────────────────────────────

export function listRecommendations(
  token: string,
  branchId: string,
  type?: RecommendationType,
  status?: string,
) {
  const params = new URLSearchParams({ branch_id: branchId });
  if (type) params.set("type", type);
  if (status) params.set("status", status);
  return apiFetchAuthed<Recommendation[]>(`/api/v1/recommendations?${params.toString()}`, token);
}

export function actOnRecommendation(
  token: string,
  recommendationId: string,
  body: RecommendationActionRequest,
) {
  return apiFetchAuthed<Recommendation>(
    `/api/v1/recommendations/${recommendationId}/action`,
    token,
    { method: "POST", body: JSON.stringify(body) },
  );
}

export function measureOutcome(token: string, recommendationId: string) {
  return apiFetchAuthed<{ recommendation_id: string; outcome_value: object; outcome_delta: number }>(
    `/api/v1/recommendations/${recommendationId}/measure-outcome`,
    token,
    { method: "POST" },
  );
}

export function listPricingGuardrails(token: string, branchId: string) {
  return apiFetchAuthed<PricingGuardrail[]>(
    `/api/v1/guardrails/pricing?branch_id=${branchId}`,
    token,
  );
}

export function upsertPricingGuardrail(token: string, body: PricingGuardrailInput) {
  return apiFetchAuthed<PricingGuardrail>("/api/v1/guardrails/pricing", token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function listStaffingGuardrails(token: string, branchId: string) {
  return apiFetchAuthed<StaffingGuardrail[]>(
    `/api/v1/guardrails/staffing?branch_id=${branchId}`,
    token,
  );
}

export function upsertStaffingGuardrail(token: string, body: StaffingGuardrailInput) {
  return apiFetchAuthed<StaffingGuardrail>("/api/v1/guardrails/staffing", token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
