export interface DashboardSummary {
  occupancy_pct: number;
  occupied_rooms: number;
  total_rooms: number;
  revenue_today: string;
  revenue_mtd: string;
  reservations_today: number;
  reservations_pending: number;
  restaurant_sales_today: string;
  restaurant_orders_open: number;
}

export interface DailyOccupancy {
  date: string;
  occupancy_pct: number;
  occupied_rooms: number;
  total_rooms: number;
}

export interface DailyRevenue {
  date: string;
  revenue: string;
}
