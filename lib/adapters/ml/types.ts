/**
 * The ML adapter deliberately does not define its own shapes — mock responses
 * must satisfy exactly the same contracts the real ML endpoints return, so
 * both paths are interchangeable to callers.
 */
export type {
  ChurnPredictResponse,
  InsightItem,
  MealForecast,
  ModelMeta,
  OccupancyDayForecast,
  OccupancyForecastRequest,
  OccupancyForecastResponse,
  PricingRecommendRequest,
  PricingRecommendResponse,
  RagCitation,
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
} from "@/lib/types/ml";
