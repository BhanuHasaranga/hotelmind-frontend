export interface ModelMeta {
  model_version: number | string;
  trained_at: string;
  mlflow_experiment_id: string | null;
  latency_ms: number;
  confidence: number | null;
}

// ── Pricing ───────────────────────────────────────────────────────────────

export interface PricingRecommendRequest {
  branch_id: string;
  room_type_id: string;
  date: string;
  current_occupancy_pct: number;
  current_revenue: number;
  revenue_7day_avg: number;
  total_rooms: number;
}

export interface PricingRecommendResponse {
  recommendation_id: string;
  branch_id: string;
  room_type_id: string;
  date: string;
  recommended_price: number;
  expected_revenue: number;
  guardrail_clamped: boolean;
  meta: ModelMeta | null;
}

// ── Occupancy ─────────────────────────────────────────────────────────────

export interface OccupancyForecastRequest {
  branch_id: string;
  horizon_days?: number;
}

export interface OccupancyDayForecast {
  date: string;
  predicted_occupancy_pct: number;
  ci_lower: number;
  ci_upper: number;
  model_used: string;
}

export interface OccupancyForecastResponse {
  branch_id: string;
  forecast: OccupancyDayForecast[];
  meta: ModelMeta | null;
}

// ── Restaurant demand ─────────────────────────────────────────────────────

export interface RestaurantDemandRequest {
  branch_id: string;
  date: string;
  recent_total_orders_lag_1: number;
  recent_total_orders_lag_7: number;
  recent_total_orders_rolling_mean_7: number;
  avg_item_value: number;
}

export interface MealForecast {
  expected_quantity: number;
  expected_revenue: number;
}

export interface RestaurantDemandResponse {
  recommendation_id: string;
  branch_id: string;
  date: string;
  breakfast: MealForecast;
  lunch: MealForecast;
  dinner: MealForecast;
  meta: ModelMeta | null;
}

// ── Staffing ──────────────────────────────────────────────────────────────

export interface StaffRequirementRequest {
  branch_id: string;
  department: string;
  date: string;
  scheduled_employees: number;
  present_employees_lag_7: number;
  present_employees_rolling_mean_7: number;
}

export interface StaffRequirementResponse {
  recommendation_id: string;
  branch_id: string;
  department: string;
  date: string;
  required_staff: number;
  confidence_note: string;
  meta: ModelMeta | null;
}

// ── Churn ─────────────────────────────────────────────────────────────────

export interface ChurnPredictResponse {
  recommendation_id: string | null;
  guest_id: string;
  churn_probability: number | null;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | string;
  model_used: string;
  note: string | null;
  meta: ModelMeta | null;
}

// ── AI Assistant (RAG) ────────────────────────────────────────────────────

export interface RagCitation {
  source: string;
  doc_type: string | null;
  score: number;
}

export interface RagQueryResponse {
  answer: string;
  citations: RagCitation[];
  used_llm: boolean;
}

// ── Insights ──────────────────────────────────────────────────────────────

export interface InsightItem {
  category: string;
  title: string;
  metric: string;
  metric_delta: number | null;
  severity: string;
  supporting_data: Record<string, unknown>;
  citation: string;
  priority_score: number;
  recommendation: string;
}

// ── Reviews ───────────────────────────────────────────────────────────────

export interface ReviewsSummaryResponse {
  summary: string;
  keywords: string[];
  csat_by_hotel: Record<string, unknown>[];
}

export interface ReviewsTopicsResponse {
  topics: Record<string, unknown>[];
}

export interface ReviewsComplaintsResponse {
  complaints: Record<string, unknown>[];
}

export interface ReviewsTrendsResponse {
  grain: string;
  series: Record<string, unknown>[];
  trend_by_hotel: Record<string, unknown>;
}

// ── Closed-loop recommendations ──────────────────────────────────────────

export type RecommendationType =
  | "PRICING"
  | "STAFFING"
  | "RESTAURANT_DEMAND"
  | "CHURN_INTERVENTION";

export type RecommendationStatus = "SHOWN" | "ACCEPTED" | "MODIFIED" | "DISMISSED";

export interface Recommendation {
  id: string;
  branch_id: string;
  type: RecommendationType;
  entity_ref: string | null;
  payload: Record<string, unknown>;
  shown_to_user_id: string;
  shown_at: string;
  status: RecommendationStatus;
  action_taken_at: string | null;
  applied_value: Record<string, unknown> | null;
  outcome_measured_at: string | null;
  outcome_value: Record<string, unknown> | null;
  outcome_delta: number | null;
}

export interface RecommendationActionRequest {
  status: "ACCEPTED" | "MODIFIED" | "DISMISSED";
  applied_value?: Record<string, unknown> | null;
}

export interface PricingGuardrail {
  id: string;
  branch_id: string;
  room_type_id: string | null;
  min_price: number;
  max_price: number;
  max_daily_change_pct: number;
}

export interface PricingGuardrailInput {
  branch_id: string;
  room_type_id?: string | null;
  min_price: number;
  max_price: number;
  max_daily_change_pct?: number;
}

export interface StaffingGuardrail {
  id: string;
  branch_id: string;
  department_id: string;
  min_headcount: number;
  max_headcount: number;
}

export interface StaffingGuardrailInput {
  branch_id: string;
  department_id: string;
  min_headcount?: number;
  max_headcount: number;
}
