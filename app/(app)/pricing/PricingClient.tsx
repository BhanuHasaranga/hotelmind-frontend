"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/ToastProvider";
import { PriceRecommendationCard } from "@/components/pricing/PriceRecommendationCard";
import { GuardrailSheet } from "@/components/pricing/GuardrailSheet";
import { OccupancyRevenueTrendChart } from "@/components/pricing/OccupancyRevenueTrendChart";
import { RecommendationHistoryTable } from "@/components/pricing/RecommendationHistoryTable";
import {
  actOnRecommendation,
  forecastOccupancy,
  listPricingGuardrails,
  listRecommendations,
  recommendPricing,
  upsertPricingGuardrail,
} from "@/lib/api/ml";
import type { RoomType } from "@/lib/types/hotel";
import type { DailyOccupancy } from "@/lib/types/dashboard";
import type {
  OccupancyDayForecast,
  PricingGuardrail,
  PricingRecommendResponse,
  Recommendation,
} from "@/lib/types/ml";

interface PricingClientProps {
  token: string;
  branchId: string;
  roomTypes: RoomType[];
  occupancyHistory: DailyOccupancy[];
  currentOccupancyPct: number;
  currentRevenue: number;
  revenue7dayAvg: number;
  totalRooms: number;
  initialRecommendations: Recommendation[];
  initialGuardrails: PricingGuardrail[];
}

export function PricingClient({
  token,
  branchId,
  roomTypes,
  occupancyHistory,
  currentOccupancyPct,
  currentRevenue,
  revenue7dayAvg,
  totalRooms,
  initialRecommendations,
  initialGuardrails,
}: PricingClientProps) {
  const { toast } = useToast();
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(roomTypes[0]?.id ?? "");
  const [recommendation, setRecommendation] = useState<PricingRecommendResponse | null>(null);
  const [forecast, setForecast] = useState<OccupancyDayForecast[]>([]);
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [guardrails, setGuardrails] = useState(initialGuardrails);
  const [guardrailSheetOpen, setGuardrailSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedRoomType = roomTypes.find((rt) => rt.id === selectedRoomTypeId);
  const activeGuardrail =
    guardrails.find((g) => g.room_type_id === selectedRoomTypeId) ??
    guardrails.find((g) => g.room_type_id === null) ??
    null;

  async function handleGetRecommendation() {
    if (!selectedRoomType) return;
    setLoading(true);
    setRecommendation(null);
    try {
      const [pricingResult, occupancyResult] = await Promise.all([
        recommendPricing(token, {
          branch_id: branchId,
          room_type_id: selectedRoomType.id,
          date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
          current_occupancy_pct: currentOccupancyPct,
          current_revenue: currentRevenue,
          revenue_7day_avg: revenue7dayAvg,
          total_rooms: totalRooms,
        }),
        forecastOccupancy(token, { branch_id: branchId, horizon_days: 14 }),
      ]);
      setRecommendation(pricingResult);
      setForecast(occupancyResult.forecast);
    } catch (err) {
      toast({
        title: "Could not get recommendation",
        description: err instanceof Error ? err.message : "The ML service may be unavailable.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  async function refreshRecommendations() {
    const updated = await listRecommendations(token, branchId, "PRICING");
    setRecommendations(updated);
  }

  async function handleAccept() {
    if (!recommendation) return;
    await actOnRecommendation(token, recommendation.recommendation_id, { status: "ACCEPTED" });
    toast({
      title: "Price applied",
      description: `Base price updated to $${recommendation.recommended_price.toFixed(2)}.`,
      variant: "success",
    });
    setRecommendation(null);
    await refreshRecommendations();
  }

  async function handleDismiss() {
    if (!recommendation) return;
    await actOnRecommendation(token, recommendation.recommendation_id, { status: "DISMISSED" });
    setRecommendation(null);
    await refreshRecommendations();
  }

  async function handleSaveGuardrail(values: {
    minPrice: number;
    maxPrice: number;
    maxDailyChangePct: number;
  }) {
    const saved = await upsertPricingGuardrail(token, {
      branch_id: branchId,
      room_type_id: selectedRoomTypeId,
      min_price: values.minPrice,
      max_price: values.maxPrice,
      max_daily_change_pct: values.maxDailyChangePct,
    });
    setGuardrails((prev) => [...prev.filter((g) => g.id !== saved.id), saved]);
    toast({ title: "Guardrail saved", variant: "success" });
  }

  if (roomTypes.length === 0) {
    return (
      <EmptyState
        icon="pricing"
        title="No room types found"
        description="Add room types to this branch before requesting pricing recommendations."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Get a Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Room type</label>
              <Select
                size="sm"
                value={selectedRoomTypeId}
                onChange={(e) => setSelectedRoomTypeId(e.target.value)}
                options={roomTypes.map((rt) => ({
                  value: rt.id,
                  label: `${rt.name} · $${rt.base_price}`,
                }))}
              />
            </div>
            <Button size="sm" onClick={handleGetRecommendation} disabled={loading || !selectedRoomType}>
              {loading ? "Generating…" : "Get Recommendation"}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setGuardrailSheetOpen(true)}>
              Guardrails
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && <Skeleton className="h-40 w-full" />}

      {recommendation && selectedRoomType && (
        <PriceRecommendationCard
          recommendation={recommendation}
          currentPrice={Number(selectedRoomType.base_price)}
          onAccept={handleAccept}
          onDismiss={handleDismiss}
        />
      )}

      {(occupancyHistory.length > 0 || forecast.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Occupancy: History &amp; Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <OccupancyRevenueTrendChart history={occupancyHistory} forecast={forecast} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recommendation History</CardTitle>
        </CardHeader>
        <CardContent>
          <RecommendationHistoryTable recommendations={recommendations} />
        </CardContent>
      </Card>

      <GuardrailSheet
        open={guardrailSheetOpen}
        onClose={() => setGuardrailSheetOpen(false)}
        branchId={branchId}
        roomTypeId={selectedRoomTypeId}
        existing={activeGuardrail}
        onSave={handleSaveGuardrail}
      />
    </div>
  );
}
