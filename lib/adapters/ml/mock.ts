import { seededRandom, pick, range, dailySeedKey } from "../seed";
import type {
  ChurnPredictResponse,
  InsightItem,
  ModelMeta,
  OccupancyDayForecast,
  OccupancyForecastRequest,
  OccupancyForecastResponse,
  PricingRecommendRequest,
  PricingRecommendResponse,
  RagQueryResponse,
  Recommendation,
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
 * Deterministic stand-ins for the hotelmind-ml predictions. Every generator is
 * seeded off the branch + day (or a stable entity id) via lib/adapters/seed,
 * so a given demo session sees consistent numbers instead of values that jump
 * on each render — same contract as every other mock adapter here.
 */

const MODEL_VERSION = "demo";

/** Real predictions take a moment; without this, skeletons flash by too fast to read as work. */
export function mockLatency(rand: () => number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, range(rand, 300, 700)));
}

function meta(rand: () => number, confidence: number): ModelMeta {
  return {
    model_version: MODEL_VERSION,
    trained_at: new Date(Date.now() - range(rand, 3, 21) * 86_400_000).toISOString(),
    mlflow_experiment_id: null,
    latency_ms: range(rand, 40, 180),
    confidence,
  };
}

function round(value: number, dp = 2): number {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
}

function isoDay(offsetDays: number): string {
  return new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
}

// ── Pricing ───────────────────────────────────────────────────────────────

export async function mockRecommendPricing(
  body: PricingRecommendRequest,
): Promise<PricingRecommendResponse> {
  const rand = seededRandom(dailySeedKey(body.branch_id, `pricing:${body.room_type_id}:${body.date}`));
  await mockLatency(rand);

  // Anchor on the observed revenue per occupied room so the suggestion tracks
  // whatever the real booking data currently says, then nudge by occupancy
  // pressure the way the real model would.
  const occupiedRooms = Math.max(1, Math.round((body.current_occupancy_pct / 100) * body.total_rooms));
  const observedRate = body.current_revenue > 0 ? body.current_revenue / occupiedRooms : 120;
  const demandPressure = (body.current_occupancy_pct - 65) / 100; // >65% occupancy pushes price up
  const jitter = (rand() - 0.5) * 0.06;
  const recommended = Math.max(45, observedRate * (1 + demandPressure * 0.35 + jitter));

  return {
    recommendation_id: `mock-pricing-${body.room_type_id}-${body.date}`,
    branch_id: body.branch_id,
    room_type_id: body.room_type_id,
    date: body.date,
    recommended_price: round(recommended),
    expected_revenue: round(recommended * occupiedRooms * (1 + (rand() - 0.3) * 0.08)),
    guardrail_clamped: false,
    meta: meta(rand, round(0.72 + rand() * 0.2, 2)),
  };
}

// ── Occupancy ─────────────────────────────────────────────────────────────

export async function mockForecastOccupancy(
  body: OccupancyForecastRequest,
): Promise<OccupancyForecastResponse> {
  const horizon = body.horizon_days ?? 14;
  const rand = seededRandom(dailySeedKey(body.branch_id, `occupancy:${horizon}`));
  await mockLatency(rand);

  const base = range(rand, 58, 74);
  const forecast: OccupancyDayForecast[] = Array.from({ length: horizon }, (_, i) => {
    const date = new Date(Date.now() + (i + 1) * 86_400_000);
    const dow = date.getUTCDay();
    // Weekend lift, midweek dip — the seasonality the real model learns.
    const seasonal = dow === 5 || dow === 6 ? 14 : dow === 0 ? 6 : dow === 2 || dow === 3 ? -5 : 0;
    // Confidence widens with the horizon, so the CI band fans out.
    const spread = 3 + i * 0.6;
    const predicted = Math.min(98, Math.max(22, base + seasonal + (rand() - 0.5) * 8));

    return {
      date: date.toISOString().slice(0, 10),
      predicted_occupancy_pct: round(predicted, 1),
      ci_lower: round(Math.max(0, predicted - spread), 1),
      ci_upper: round(Math.min(100, predicted + spread), 1),
      model_used: MODEL_VERSION,
    };
  });

  return { branch_id: body.branch_id, forecast, meta: meta(rand, 0.81) };
}

// ── Restaurant demand ─────────────────────────────────────────────────────

export async function mockForecastRestaurantDemand(
  body: RestaurantDemandRequest,
): Promise<RestaurantDemandResponse> {
  const rand = seededRandom(dailySeedKey(body.branch_id, `restaurant:${body.date}`));
  await mockLatency(rand);

  // Scale off the caller's own rolling mean so the forecast stays proportional
  // to the branch's real order volume.
  const baseline = Math.max(12, body.recent_total_orders_rolling_mean_7 || 40);
  const itemValue = body.avg_item_value > 0 ? body.avg_item_value : 18;

  const meal = (share: number) => {
    const quantity = Math.max(1, Math.round(baseline * share * (0.9 + rand() * 0.25)));
    return {
      expected_quantity: quantity,
      expected_revenue: round(quantity * itemValue * (0.95 + rand() * 0.2)),
    };
  };

  return {
    recommendation_id: `mock-restaurant-${body.date}`,
    branch_id: body.branch_id,
    date: body.date,
    breakfast: meal(0.42),
    lunch: meal(0.3),
    dinner: meal(0.55),
    meta: meta(rand, round(0.68 + rand() * 0.2, 2)),
  };
}

// ── Staffing ──────────────────────────────────────────────────────────────

export async function mockRecommendStaffRequirements(
  body: StaffRequirementRequest,
): Promise<StaffRequirementResponse> {
  const rand = seededRandom(dailySeedKey(body.branch_id, `staffing:${body.department}:${body.date}`));
  await mockLatency(rand);

  const baseline = body.present_employees_rolling_mean_7 || body.scheduled_employees || 6;
  const required = Math.max(1, Math.round(baseline * (0.9 + rand() * 0.35)));
  const delta = required - body.scheduled_employees;

  const confidence_note =
    delta > 0
      ? `Forecast demand exceeds the current schedule by ${delta} — consider adding cover.`
      : delta < 0
        ? `The current schedule is ${Math.abs(delta)} above forecast demand — there is room to trim.`
        : "The current schedule matches forecast demand.";

  return {
    recommendation_id: `mock-staffing-${body.department}-${body.date}`,
    branch_id: body.branch_id,
    department: body.department,
    date: body.date,
    required_staff: required,
    confidence_note,
    meta: meta(rand, round(0.7 + rand() * 0.2, 2)),
  };
}

// ── Churn ─────────────────────────────────────────────────────────────────

export async function mockPredictChurn(guestId: string): Promise<ChurnPredictResponse> {
  // Seeded on the guest alone: the same guest must always score the same, even
  // across days, or flagging one twice would contradict itself.
  const rand = seededRandom(`churn:${guestId}`);
  await mockLatency(rand);

  const probability = round(0.12 + rand() * 0.78, 3);
  const risk_level = probability >= 0.66 ? "HIGH" : probability >= 0.38 ? "MEDIUM" : "LOW";

  return {
    recommendation_id: `mock-churn-${guestId}`,
    guest_id: guestId,
    churn_probability: probability,
    risk_level,
    model_used: MODEL_VERSION,
    note:
      risk_level === "HIGH"
        ? "Recent sentiment and stay history both trend negative — a recovery gesture is warranted."
        : risk_level === "MEDIUM"
          ? "Some negative signals, but this guest's history is otherwise stable."
          : "No meaningful churn signal for this guest.",
    meta: meta(rand, round(0.64 + rand() * 0.24, 2)),
  };
}

// ── Reviews ───────────────────────────────────────────────────────────────

const TOPICS = [
  "Room cleanliness",
  "Check-in speed",
  "Breakfast quality",
  "Wi-Fi reliability",
  "Staff friendliness",
  "Noise levels",
  "Air conditioning",
  "Value for money",
];

const COMPLAINTS = [
  "Check-in took nearly 30 minutes even though we arrived after the stated time.",
  "The air conditioning in our room was noisy through the night.",
  "Breakfast ran out of hot options before 9am on both mornings.",
  "Wi-Fi kept dropping in the room, though it was fine in the lobby.",
  "The bathroom was not fully cleaned when we arrived.",
  "Corridor noise from an adjacent event carried into the room until late.",
];

export async function mockGetReviewsSummary(): Promise<ReviewsSummaryResponse> {
  const rand = seededRandom(dailySeedKey("reviews", "summary"));
  await mockLatency(rand);

  return {
    summary:
      "Overall guest sentiment is positive and stable, driven mainly by staff friendliness and room comfort. " +
      "The recurring drag is operational rather than product: check-in queues at peak arrival hours and " +
      "inconsistent breakfast restocking account for most of the negative comments this period. " +
      "Cleanliness scores recovered after the mid-period dip and are now back above target.",
    keywords: ["friendly staff", "comfortable rooms", "slow check-in", "breakfast", "great location"],
    csat_by_hotel: [],
  };
}

export async function mockGetReviewsTopics(): Promise<ReviewsTopicsResponse> {
  const rand = seededRandom(dailySeedKey("reviews", "topics"));
  await mockLatency(rand);

  return {
    // Keys match what TopicsBreakdown reads ("topic"/"count").
    topics: TOPICS.map((topic) => ({
      topic,
      count: range(rand, 4, 48),
      sentiment: round(rand() * 2 - 0.6, 2),
    })).sort((a, b) => (b.count as number) - (a.count as number)),
  };
}

export async function mockGetReviewsComplaints(): Promise<ReviewsComplaintsResponse> {
  const rand = seededRandom(dailySeedKey("reviews", "complaints"));
  await mockLatency(rand);

  // Keys match ComplaintsFeed's readers: comment / guest_id / date. The guest
  // ids are stable so a flagged guest keeps the same churn score.
  return {
    complaints: Array.from({ length: range(rand, 3, 5) }, (_, i) => ({
      comment: pick(rand, COMPLAINTS),
      guest_id: `mock-guest-${i}${range(rand, 1000, 9999)}`,
      date: isoDay(-range(rand, 1, 14)),
      rating: range(rand, 1, 3),
    })),
  };
}

export async function mockGetReviewsTrends(
  grain: "daily" | "weekly" | "monthly" = "weekly",
): Promise<ReviewsTrendsResponse> {
  const rand = seededRandom(dailySeedKey("reviews", `trends:${grain}`));
  await mockLatency(rand);

  const points = grain === "daily" ? 21 : grain === "monthly" ? 8 : 12;
  const stepDays = grain === "daily" ? 1 : grain === "monthly" ? 30 : 7;

  let score = 0.45 + rand() * 0.2;
  const series = Array.from({ length: points }, (_, i) => {
    // Random walk with a gentle upward drift, clamped to a plausible range.
    score = Math.min(0.92, Math.max(0.1, score + (rand() - 0.42) * 0.09));
    return {
      // SentimentTrendChart looks for "period"/"date" then a score key.
      period: isoDay(-(points - i) * stepDays),
      avg_sentiment_score: round(score, 3),
      review_count: range(rand, 6, 40),
    };
  });

  return { grain, series, trend_by_hotel: {} };
}

// ── Insights ──────────────────────────────────────────────────────────────

const INSIGHTS: InsightItem[] = [
  {
    category: "revenue",
    title: "Weekend rates are trailing demand",
    metric: "occupancy_pct",
    metric_delta: 8.4,
    severity: "warning",
    supporting_data: {},
    citation: "occupancy_forecast",
    priority_score: 0.86,
    recommendation: "Forecast weekend occupancy is 8pp above the trailing average — raise weekend rates.",
  },
  {
    category: "operations",
    title: "Housekeeping turnaround slipping",
    metric: "avg_turnaround_minutes",
    metric_delta: 6.1,
    severity: "warning",
    supporting_data: {},
    citation: "housekeeping_tasks",
    priority_score: 0.71,
    recommendation: "Third-floor turnaround is running 6 minutes over target — rebalance the morning rota.",
  },
  {
    category: "guest",
    title: "Check-in wait times drive negative sentiment",
    metric: "sentiment_score",
    metric_delta: -0.12,
    severity: "info",
    supporting_data: {},
    citation: "reviews_topics",
    priority_score: 0.64,
    recommendation: "Add a second front-desk agent during the 15:00–18:00 arrival peak.",
  },
];

export async function mockGetInsights(): Promise<{ insights: InsightItem[] }> {
  const rand = seededRandom(dailySeedKey("insights", "all"));
  await mockLatency(rand);
  return { insights: INSIGHTS };
}

export async function mockGetExecutiveInsights(): Promise<{
  narrative: string;
  top_findings: InsightItem[];
}> {
  const rand = seededRandom(dailySeedKey("insights", "executive"));
  await mockLatency(rand);

  return {
    narrative:
      "Revenue is tracking ahead of plan on the back of stronger weekend demand, but pricing has not yet " +
      "caught up to it — that gap is the single largest recoverable upside this period. Operationally, " +
      "housekeeping turnaround and front-desk queueing are the two constraints showing up in guest sentiment.",
    top_findings: INSIGHTS,
  };
}

// ── AI Assistant (RAG) ────────────────────────────────────────────────────

interface CannedAnswer {
  keywords: string[];
  answer: string;
  citations: { source: string; doc_type: string }[];
}

/**
 * Scripted answers for the live portfolio demo. Keyword sets cover the
 * role-specific prompts offered by components/assistant/SuggestedPrompts so
 * every suggestion chip lands on a relevant response.
 */
const CANNED: CannedAnswer[] = [
  {
    keywords: ["occupancy", "forecast", "occupied", "risk to occupancy"],
    answer:
      "Occupancy is forecast at 71% across the next 14 days, against 66% for the trailing two weeks.\n\n" +
      "The lift is concentrated on Friday and Saturday nights, which are projected at 84–88%, while Tuesday " +
      "and Wednesday sit at 52–58%. The main risk to the forecast is the midweek block: two corporate " +
      "reservations covering 14 room-nights are still unconfirmed, and losing them would pull midweek " +
      "occupancy down roughly 6 percentage points.",
    citations: [
      { source: "occupancy_forecast_14d", doc_type: "model_output" },
      { source: "reservations_pipeline", doc_type: "table" },
    ],
  },
  {
    keywords: ["revenue", "trending", "revpar", "adr", "room types generate"],
    answer:
      "Revenue is up 9.2% month-to-date versus the same period last month, with ADR contributing more of " +
      "the gain than volume.\n\n" +
      "Deluxe and Suite room types generate 58% of room revenue from 34% of inventory — they are carrying " +
      "the RevPAR improvement. Standard rooms are close to flat: occupancy there is healthy, but rates have " +
      "not moved, which is where the remaining upside sits.",
    citations: [
      { source: "revenue_daily_rollup", doc_type: "table" },
      { source: "room_type_performance", doc_type: "table" },
    ],
  },
  {
    keywords: ["pricing", "price", "rate", "improve next weekend"],
    answer:
      "For next weekend the model recommends raising Deluxe and Suite rates by 8–12% and holding Standard " +
      "flat.\n\n" +
      "Forecast weekend occupancy of 86% is well above the 65% threshold where demand-based increases " +
      "historically hold without suppressing bookings. Your configured guardrails cap the daily change at " +
      "15%, so the full recommendation is applicable without clamping. Expected effect is roughly +$2,400 " +
      "in room revenue over the two nights.",
    citations: [
      { source: "pricing_recommendations", doc_type: "model_output" },
      { source: "pricing_guardrails", doc_type: "config" },
    ],
  },
  {
    keywords: ["staffing", "staff", "understaffed", "headcount", "rota", "department"],
    answer:
      "Tomorrow's forecast calls for 24 staff against 21 currently scheduled, so you are 3 short.\n\n" +
      "The gap is entirely in Housekeeping (needs 11, scheduled 8), driven by a heavier-than-usual " +
      "checkout block in the morning. Front Desk and F&B are both adequately covered. Later in the week, " +
      "Friday and Saturday are the other two days where forecast demand exceeds the current rota.",
    citations: [
      { source: "staffing_requirements", doc_type: "model_output" },
      { source: "staff_schedule", doc_type: "table" },
    ],
  },
  {
    keywords: ["complaint", "negative review", "sentiment", "satisfaction", "guest experience"],
    answer:
      "The most common complaint themes this month are check-in speed (31 mentions), breakfast " +
      "availability (24), and room noise (18).\n\n" +
      "Check-in is the clearest operational fix: the complaints cluster tightly in the 15:00–18:00 arrival " +
      "peak, when a single agent is on the desk. Overall sentiment remains positive at 0.62 and has " +
      "recovered from the mid-period dip, with staff friendliness the most-praised theme.",
    citations: [
      { source: "reviews_topics", doc_type: "model_output" },
      { source: "reviews_trends", doc_type: "model_output" },
      { source: "reviews_raw", doc_type: "table" },
    ],
  },
  {
    keywords: ["churn", "at risk", "leaving a bad review", "leave"],
    answer:
      "Three guests currently in-house score above the 0.66 high-risk churn threshold.\n\n" +
      "All three share the same pattern: a service issue logged during the stay, no follow-up recorded, and " +
      "a below-average sentiment score on a prior stay. Guests matching that pattern historically leave a " +
      "review of 2 stars or lower about 40% of the time. A proactive gesture before checkout is the " +
      "intervention with the best measured effect.",
    citations: [
      { source: "churn_predictions", doc_type: "model_output" },
      { source: "guest_stay_history", doc_type: "table" },
    ],
  },
  {
    keywords: ["restaurant", "breakfast", "lunch", "dinner", "menu", "food waste", "demand"],
    answer:
      "Tomorrow's breakfast forecast is 118 covers, about 12% above the trailing seven-day average, " +
      "tracking the higher in-house guest count.\n\n" +
      "Dinner is forecast at 96 covers and lunch at 61. On menu performance, three items account for under " +
      "2% of orders each while consuming disproportionate prep time — they are the natural candidates for " +
      "rotation. Food waste is running at 8% of food cost, within the normal band but trending up slightly.",
    citations: [
      { source: "restaurant_demand_forecast", doc_type: "model_output" },
      { source: "menu_item_performance", doc_type: "table" },
    ],
  },
  {
    keywords: ["anomaly", "anomalies", "turnaround", "unusual", "outlier"],
    answer:
      "Two anomalies stand out this week.\n\n" +
      "First, third-floor room turnaround is averaging 6 minutes over target, isolated to the morning " +
      "shift — the other floors are within range, which points to rota balance rather than a process " +
      "problem. Second, Tuesday's walk-in rate was roughly triple the usual, which is what kept midweek " +
      "occupancy from falling further than forecast.",
    citations: [
      { source: "insights_anomalies", doc_type: "model_output" },
      { source: "housekeeping_tasks", doc_type: "table" },
    ],
  },
  {
    keywords: ["insight", "summary", "summarize", "this week", "key"],
    answer:
      "Three things stand out this week.\n\n" +
      "Revenue is ahead of plan on stronger weekend demand, but weekend pricing has not caught up — that " +
      "gap is the largest recoverable upside on the table. Operationally, housekeeping turnaround and " +
      "front-desk queueing at the arrival peak are the two constraints now visible in guest sentiment. " +
      "Guest satisfaction is otherwise stable and recovering from its mid-period dip.",
    citations: [
      { source: "insights_executive", doc_type: "model_output" },
      { source: "revenue_daily_rollup", doc_type: "table" },
    ],
  },
];

const FALLBACK_ANSWER =
  "This is a scripted demo response — the live deployment of this portfolio project runs without the " +
  "ML/RAG backend, so answers here are canned rather than generated.\n\n" +
  "The scripted topics cover occupancy forecasting, revenue trends, pricing recommendations, staffing " +
  "levels, guest sentiment and complaints, churn risk, restaurant demand, and operational anomalies. " +
  "Try one of the suggested prompts, or run the project locally to query the real RAG pipeline over live " +
  "hotel data.";

export async function mockQueryAssistant(query: string): Promise<RagQueryResponse> {
  const rand = seededRandom(`assistant:${query.toLowerCase().trim()}`);
  // Deliberately slower than the other mocks: an assistant that answers
  // instantly reads as canned even when the content is good.
  await new Promise((resolve) => setTimeout(resolve, range(rand, 700, 1400)));

  const normalized = query.toLowerCase();
  const match = CANNED.find((entry) => entry.keywords.some((k) => normalized.includes(k)));

  if (!match) {
    return { answer: FALLBACK_ANSWER, citations: [], used_llm: false };
  }

  return {
    answer: match.answer,
    citations: match.citations.map((c) => ({
      source: c.source,
      doc_type: c.doc_type,
      score: round(0.74 + rand() * 0.22, 3),
    })),
    used_llm: true,
  };
}

// ── Closed-loop recommendations ──────────────────────────────────────────

const RECOMMENDATION_STATUSES = ["ACCEPTED", "DISMISSED", "MODIFIED"] as const;

/**
 * Mocked predictions carry synthetic recommendation ids that do not exist in
 * Postgres, so in mock mode the history table is generated here too — a live
 * read would return rows that no mocked prediction could ever act on.
 */
export async function mockListRecommendations(
  branchId: string,
  type?: RecommendationType,
): Promise<Recommendation[]> {
  const rand = seededRandom(dailySeedKey(branchId, `recommendations:${type ?? "all"}`));
  await mockLatency(rand);

  const kind: RecommendationType = type ?? "PRICING";

  return Array.from({ length: range(rand, 3, 6) }, (_, i) => {
    const status = pick(rand, RECOMMENDATION_STATUSES);
    const shownAt = new Date(Date.now() - (i + 1) * range(rand, 1, 3) * 86_400_000).toISOString();
    const acted = status !== "DISMISSED";

    return {
      id: `mock-rec-${kind.toLowerCase()}-${i}`,
      branch_id: branchId,
      type: kind,
      entity_ref: null,
      payload: mockRecommendationPayload(kind, rand),
      shown_to_user_id: "mock-user",
      shown_at: shownAt,
      status,
      action_taken_at: acted ? shownAt : null,
      applied_value: null,
      outcome_measured_at: acted ? new Date(Date.now() - i * 86_400_000).toISOString() : null,
      outcome_value: null,
      outcome_delta: acted ? round((rand() - 0.25) * 900, 2) : null,
    };
  });
}

function mockRecommendationPayload(
  kind: RecommendationType,
  rand: () => number,
): Record<string, unknown> {
  switch (kind) {
    case "PRICING":
      return { recommended_price: range(rand, 95, 260), expected_revenue: range(rand, 1800, 7400) };
    case "STAFFING":
      return { required_staff: range(rand, 4, 14), department: pick(rand, ["Housekeeping", "Front Desk", "F&B"]) };
    case "RESTAURANT_DEMAND":
      return { expected_quantity: range(rand, 40, 160), expected_revenue: range(rand, 700, 3200) };
    case "CHURN_INTERVENTION":
      return { churn_probability: round(0.5 + rand() * 0.45, 3) };
  }
}

/**
 * Accepting a mocked recommendation cannot round-trip through the real
 * /recommendations router (the id was never persisted), so the acted-on record
 * is synthesized here to keep the accept → toast → refresh flow intact.
 */
export async function mockActOnRecommendation(
  recommendationId: string,
  status: "ACCEPTED" | "MODIFIED" | "DISMISSED",
  appliedValue?: Record<string, unknown> | null,
): Promise<Recommendation> {
  const rand = seededRandom(`action:${recommendationId}`);
  await mockLatency(rand);
  const now = new Date().toISOString();

  return {
    id: recommendationId,
    branch_id: "mock-branch",
    type: "PRICING",
    entity_ref: null,
    payload: {},
    shown_to_user_id: "mock-user",
    shown_at: now,
    status,
    action_taken_at: now,
    applied_value: appliedValue ?? null,
    outcome_measured_at: null,
    outcome_value: null,
    outcome_delta: null,
  };
}

export async function mockMeasureOutcome(recommendationId: string): Promise<{
  recommendation_id: string;
  outcome_value: object;
  outcome_delta: number;
}> {
  const rand = seededRandom(`outcome:${recommendationId}`);
  await mockLatency(rand);

  return {
    recommendation_id: recommendationId,
    outcome_value: {},
    outcome_delta: round((rand() - 0.2) * 1200, 2),
  };
}
