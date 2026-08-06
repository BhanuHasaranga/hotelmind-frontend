export interface WeatherSnapshot {
  condition: "sunny" | "cloudy" | "rain" | "storm";
  tempC: number;
  summary: string;
}

export interface LocalEvent {
  id: string;
  name: string;
  date: string;
  expectedDemandImpact: "low" | "medium" | "high";
}

export interface StaffUtilization {
  utilizationPct: number;
  scheduledStaff: number;
  requiredStaff: number;
}

export interface FoodWasteMetric {
  wastePct: number;
  wasteCostToday: number;
  trend: "up" | "down" | "flat";
}

export interface MaintenanceAlertSummary {
  openTickets: number;
  urgentTickets: number;
}

export interface AIInsight {
  id: string;
  category: "revenue" | "operational" | "guest";
  severity: "info" | "warning" | "critical";
  message: string;
}

export interface DashboardExtras {
  weather: WeatherSnapshot;
  events: LocalEvent[];
  staffUtilization: StaffUtilization;
  foodWaste: FoodWasteMetric;
  maintenanceAlerts: MaintenanceAlertSummary;
  aiInsights: AIInsight[];
}
