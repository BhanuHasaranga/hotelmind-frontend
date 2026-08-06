/**
 * Deterministic seeded PRNG (mulberry32) shared by every mock adapter so
 * demo data stays stable across renders for a given seed key (e.g. a
 * branch id + date) instead of visibly jumping on every SSR pass.
 */
export function seededRandom(seedKey: string): () => number {
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed << 5) - seed + seedKey.charCodeAt(i);
    seed |= 0;
  }
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}

export function range(rand: () => number, min: number, max: number): number {
  return Math.floor(min + rand() * (max - min + 1));
}

/** Stable per-day seed key so mock data changes once per day, not per request. */
export function dailySeedKey(branchId: string, salt = ""): string {
  const day = new Date().toISOString().slice(0, 10);
  return `${branchId}:${day}:${salt}`;
}
