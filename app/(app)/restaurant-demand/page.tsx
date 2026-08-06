import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { RestaurantDemandClient } from "./RestaurantDemandClient";
import { apiFetchAuthed } from "@/lib/api";
import { getActiveBranch } from "@/lib/auth/branch";
import type { FoodCategory, MenuItem } from "@/lib/types/restaurant";
import type { DashboardSummary } from "@/lib/types/dashboard";

async function getCategories(branchId: string, token: string): Promise<FoodCategory[]> {
  try {
    return await apiFetchAuthed<FoodCategory[]>(`/api/v1/restaurant/categories?branch_id=${branchId}`, token);
  } catch {
    return [];
  }
}

async function getMenuItems(token: string): Promise<MenuItem[]> {
  try {
    return await apiFetchAuthed<MenuItem[]>("/api/v1/restaurant/menu-items", token);
  } catch {
    return [];
  }
}

async function getSummary(branchId: string, token: string): Promise<DashboardSummary | null> {
  try {
    return await apiFetchAuthed<DashboardSummary>(`/api/v1/dashboard/summary?branch_id=${branchId}`, token);
  } catch {
    return null;
  }
}

export default async function RestaurantDemandPage() {
  const active = await getActiveBranch();

  if (!active?.branchId) {
    return (
      <>
        <TopBar title="Demand Forecast" subtitle="AI-predicted restaurant demand" dataSource="beta" />
        <p className="mt-6 text-sm text-muted-foreground">
          Select a branch from the switcher above to view demand forecasts.
        </p>
      </>
    );
  }

  const { branchId, session } = active;
  const [categories, menuItems, summary] = await Promise.all([
    getCategories(branchId, session.token),
    getMenuItems(session.token),
    getSummary(branchId, session.token),
  ]);

  // The ML forecast model expects recent order-volume features (lag_1,
  // lag_7, rolling_mean_7) that this branch's live order history would
  // normally supply; the dashboard summary only exposes today's snapshot,
  // so today's open-order count stands in as a rough proxy for all three
  // until a dedicated historical-orders endpoint exists.
  const proxyOrderCount = summary?.restaurant_orders_open ?? 5;
  const avgItemValue =
    summary && summary.restaurant_orders_open > 0
      ? Number(summary.restaurant_sales_today) / summary.restaurant_orders_open
      : 15;

  return (
    <>
      <TopBar title="Demand Forecast" subtitle="AI-predicted restaurant demand and prep planning" dataSource="beta" />
      <div className="mt-6 space-y-4">
        <p className="text-xs text-muted-foreground">
          Looking for live orders and tables?{" "}
          <Link href="/restaurant" className="text-primary hover:underline">
            Go to Restaurant Operations
          </Link>
        </p>
        <RestaurantDemandClient
          token={session.token}
          branchId={branchId}
          categories={categories}
          menuItems={menuItems}
          recentOrderCounts={{
            lag1: proxyOrderCount,
            lag7: proxyOrderCount,
            rollingMean7: proxyOrderCount,
            avgItemValue,
          }}
        />
      </div>
    </>
  );
}
