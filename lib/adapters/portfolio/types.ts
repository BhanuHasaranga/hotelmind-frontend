export interface PropertyPerformance {
  id: string;
  hotelName: string;
  branchName: string;
  occupancyPct: number;
  revPar: number;
  adr: number;
  revenueMtd: number;
  guestSatisfaction: number;
}

export interface PortfolioSummary {
  properties: PropertyPerformance[];
  portfolioRevPar: number;
  portfolioOccupancyPct: number;
  bestPerformerId: string;
  worstPerformerId: string;
}
