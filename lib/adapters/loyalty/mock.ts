import { seededRandom, pick, range, dailySeedKey } from "../seed";
import type { LoyaltyMember, LoyaltySummary, LoyaltyTier } from "./types";

const TIERS: LoyaltyTier[] = ["SILVER", "GOLD", "PLATINUM"];
const FIRST_NAMES = ["Amara", "Kenji", "Sofia", "Lucas", "Priya", "Mateo", "Elena", "Noah", "Fatima", "Owen", "Isla", "Rafael"];
const LAST_NAMES = ["Silva", "Nakata", "Rossi", "Kim", "Patel", "Novak", "Bauer", "Diallo", "Chen", "Foster", "Meyer", "Okafor"];

function randomPastDate(rand: () => number, maxDaysAgo: number): string {
  return new Date(Date.now() - range(rand, 0, maxDaysAgo) * 86_400_000).toISOString().slice(0, 10);
}

export function getLoyaltySummary(branchId: string): LoyaltySummary {
  const rand = seededRandom(dailySeedKey(branchId, "loyalty"));
  const memberCount = range(rand, 20, 40);

  const members: LoyaltyMember[] = Array.from({ length: memberCount }, (_, i) => ({
    id: `loy-${i}`,
    guestName: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
    tier: pick(rand, TIERS),
    pointsBalance: range(rand, 500, 42000),
    lifetimeStays: range(rand, 1, 38),
    lastStay: randomPastDate(rand, 240),
    memberSince: randomPastDate(rand, 1800),
  }));

  const tierCounts = TIERS.reduce(
    (acc, tier) => {
      acc[tier] = members.filter((m) => m.tier === tier).length;
      return acc;
    },
    {} as Record<LoyaltyTier, number>,
  );

  return {
    members,
    tierCounts,
    totalPointsLiability: members.reduce((sum, m) => sum + m.pointsBalance, 0),
  };
}
