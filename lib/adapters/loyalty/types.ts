export type LoyaltyTier = "SILVER" | "GOLD" | "PLATINUM";

export interface LoyaltyMember {
  id: string;
  guestName: string;
  tier: LoyaltyTier;
  pointsBalance: number;
  lifetimeStays: number;
  lastStay: string;
  memberSince: string;
}

export interface LoyaltySummary {
  members: LoyaltyMember[];
  tierCounts: Record<LoyaltyTier, number>;
  totalPointsLiability: number;
}
