import { describe, expect, it } from "vitest";
import { seededRandom, dailySeedKey } from "./seed";
import { getHousekeepingSummary } from "./housekeeping/mock";
import { getMaintenanceSummary } from "./maintenance/mock";
import { getPortfolioSummary } from "./portfolio/mock";

describe("seededRandom", () => {
  it("produces the same sequence for the same seed key", () => {
    const a = seededRandom("branch-1:2026-01-01:test");
    const b = seededRandom("branch-1:2026-01-01:test");
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it("produces a different sequence for a different seed key", () => {
    const a = seededRandom("branch-1:2026-01-01:test");
    const b = seededRandom("branch-2:2026-01-01:test");
    expect(a()).not.toEqual(b());
  });
});

describe("dailySeedKey", () => {
  it("is stable within the same day for the same branch/salt", () => {
    expect(dailySeedKey("branch-1", "salt")).toBe(dailySeedKey("branch-1", "salt"));
  });
});

describe("mock adapter determinism", () => {
  it("housekeeping mock is deterministic per branch/day", () => {
    expect(getHousekeepingSummary("branch-1")).toEqual(getHousekeepingSummary("branch-1"));
  });

  it("maintenance mock is deterministic per branch/day", () => {
    expect(getMaintenanceSummary("branch-1")).toEqual(getMaintenanceSummary("branch-1"));
  });

  it("portfolio mock is deterministic per branch/day", () => {
    expect(getPortfolioSummary("branch-1")).toEqual(getPortfolioSummary("branch-1"));
  });
});
