/**
 * HotelMind chart palette — the single source of truth for data-visualization
 * color. Chart call sites must import from here rather than passing raw hex.
 *
 * ── Why the series colors are not simply the brand colors ──────────────────
 *
 * Brand color and categorical series color do different jobs. British Racing
 * Green (#0B3D2E) and Champagne (#C9A96E) are *identity* colors: they carry the
 * HotelMind look on primary marks, emphasis, and fills. They cannot, however,
 * carry a multi-series categorical scale — #0B3D2E sits far below the
 * categorical lightness band and both fail the chroma floor, so a chart using
 * them as slots 1..n becomes unreadable for colorblind users and muddy for
 * everyone else.
 *
 * So there are two groups below:
 *   - `CHART`  — brand-forward roles for the common 1–2 series case, where the
 *                primary mark should look like HotelMind.
 *   - `SERIES` — a validated categorical scale for genuine multi-series charts.
 *                Slot 1 is a brighter green that still reads as the brand
 *                family, so brand continuity survives without breaking legibility.
 *
 * ── Validation ─────────────────────────────────────────────────────────────
 * SERIES was checked with the dataviz palette validator (six checks: lightness
 * band, chroma floor, CVD separation, normal-vision floor, contrast) and passes
 * ALL checks in both modes on the adjacent pairlist:
 *   light  worst adjacent CVD ΔE 24.2 (deutan), normal-vision ΔE 29.1
 *   dark   worst adjacent CVD ΔE 16.6 (deutan), normal-vision ΔE 23.4
 * The slot ORDER is the colorblind-safety mechanism, not cosmetic — do not
 * reorder, and do not append a 6th hue by hand. If a chart needs more than five
 * series, fold the tail into "Other" or use small multiples, then re-run the
 * validator if the palette itself ever changes.
 *
 * Caveat carried from validation: light slot 5 (#eda100) is below 3:1 contrast
 * on a light surface, so any chart that reaches slot 5 must ship visible direct
 * labels or a table view rather than relying on the swatch alone.
 */

/** Brand-forward roles — use for 1–2 series charts and for fills/emphasis. */
export const CHART = {
  /** Primary series — British Racing Green. */
  primary: "#0b3d2e",
  /** Secondary series / supporting mark. */
  secondary: "#145a43",
  /** Champagne — forecast, AI emphasis, selected mark. Use sparingly. */
  highlight: "#c9a96e",
  /** Soft area/band fill. */
  fill: "#e8f1ed",
} as const;

/** Dark-theme counterparts of the brand-forward roles. */
export const CHART_DARK = {
  primary: "#4ea88a",
  secondary: "#2b9e76",
  highlight: "#c9a96e",
  fill: "#14483a",
} as const;

/**
 * Validated categorical scale for multi-series charts. Assign in fixed order
 * (index 0 first); never cycle and never generate an extra hue.
 */
export const SERIES = ["#158f63", "#4a3aa7", "#eb6834", "#2a78d6", "#eda100"] as const;

/** Dark-mode steps of the same five hues, validated against the dark surface. */
export const SERIES_DARK = ["#2b9e76", "#9085e9", "#cf6a3c", "#4f97e8", "#ab7d14"] as const;

/**
 * Recessive grid/axis ink. These reference theme tokens so they follow the
 * active theme automatically instead of being a fixed gray.
 */
export const CHART_AXIS = "var(--color-text-muted)";
export const CHART_GRID = "var(--color-border)";
