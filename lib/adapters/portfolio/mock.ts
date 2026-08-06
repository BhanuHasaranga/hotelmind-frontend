import { seededRandom, pick, range, dailySeedKey } from "../seed";
import type { PortfolioSummary, PropertyPerformance } from "./types";

const CITIES = ["Downtown", "Airport", "Beachfront", "Old Town", "Riverside", "Uptown"];

export function getPortfolioSummary(branchId: string, hotelName = "HotelMind Group"): PortfolioSummary {
  const rand = seededRandom(dailySeedKey(branchId, "portfolio"));
  const propertyCount = range(rand, 4, 8);

  const properties: PropertyPerformance[] = Array.from({ length: propertyCount }, (_, i) => {
    const adr = range(rand, 90, 320);
    const occupancyPct = range(rand, 52, 94);
    return {
      id: `prop-${i}`,
      hotelName,
      branchName: pick(rand, CITIES) + ` ${i + 1}`,
      occupancyPct,
      adr,
      revPar: Math.round((adr * occupancyPct) / 100),
      revenueMtd: range(rand, 40_000, 320_000),
      guestSatisfaction: Number((3.6 + rand() * 1.3).toFixed(1)),
    };
  });

  const sorted = [...properties].sort((a, b) => b.revPar - a.revPar);

  return {
    properties,
    portfolioRevPar: Math.round(properties.reduce((sum, p) => sum + p.revPar, 0) / properties.length),
    portfolioOccupancyPct: Number((properties.reduce((sum, p) => sum + p.occupancyPct, 0) / properties.length).toFixed(1)),
    bestPerformerId: sorted[0]?.id ?? "",
    worstPerformerId: sorted[sorted.length - 1]?.id ?? "",
  };
}
