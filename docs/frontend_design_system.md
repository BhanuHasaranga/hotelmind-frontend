# HotelMind Frontend — Design System & Architecture

This document explains the design decisions behind the enterprise redesign, how the mock/adapter layer works, and where future backend integration points are.

## 1. Design tokens

All tokens live in `app/globals.css` as CSS custom properties, consumed by Tailwind v4's `@theme inline` block. Two layers:

- **Semantic tokens** (`--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1..5`, `--sidebar*`) — the shadcn/ui-standard names, so any shadcn component works against this theme unmodified.
- **HotelMind-specific tokens** — the pre-existing `--color-success/warning/danger/info` (+ `-bg`/`-fg` pairs) used by `Badge`, `Alert`, and status indicators, plus a new `--mock` / `--mock-foreground` pair (a distinct violet hue) used **exclusively** to mark simulated/preview data. Never reuse `--mock` for anything with real semantic meaning — its entire purpose is visual distinctiveness from real data.

Light values live under `:root`; dark values under `.dark` (class-based, toggled by `next-themes`). A `@media (prefers-color-scheme: dark)` fallback covers the brief window before the theme class hydrates, and users without a stored preference. Legacy variable names (`--card-bg`, `--sidebar-bg`, etc.) are kept alongside the new semantic names for now — do not remove them until every remaining consumer has migrated off the bracket syntax (`bg-[var(--card-bg)]`).

## 2. Theming

`next-themes` is mounted in `app/layout.tsx` (root layout, not the `(app)` route group, so `/login` themes correctly too) via `components/shared/theme-provider.tsx`, `attribute="class"`, `defaultTheme="system"`. The toggle (`components/shared/theme-toggle.tsx`) lives inside `UserMenu`'s dropdown and offers Light / Dark / System.

## 3. Component library

`components/ui/` holds primitives migrated onto Radix + `class-variance-authority` (CVA), following shadcn/ui conventions but keeping each component's **original prop API** (e.g. `Dialog`'s `open`/`onClose`/`title` props, not shadcn's composable `<Dialog><DialogTrigger>` pattern) — this was a deliberate choice to migrate every internal implementation to Radix (better focus-trap, keyboard nav, animation) without touching the dozens of existing call sites across the app. `lib/utils.ts` exports `cn()` (clsx + tailwind-merge), the standard shadcn helper.

Domain-specific components that have no shadcn equivalent stay hand-rolled: `EmptyState`, `StatCard`, `Icon` (a named lucide-react wrapper), and the new `DataSourceBadge`.

`components/shared/` holds cross-feature composed components that aren't raw primitives: `theme-provider`, `theme-toggle`, `perspective-selector`, `data-source-badge`.

## 4. Information architecture & the Perspective selector

The sidebar (`components/layout/Sidebar.tsx`) is grouped (Operations, Guests, Revenue, Restaurant, Employees, Hotels/Portfolio) instead of a flat list, with role-based filtering extended from the original array-membership check to also apply at the group level.

Only 5 real backend roles exist (`OWNER`, `REVENUE_MANAGER`, `OPS_MANAGER`, `RESTAURANT_MANAGER`, `GUEST_EXPERIENCE_MANAGER`). For personas the backend has no role for (CEO, GM, Front Office Manager, etc.), `components/shared/perspective-selector.tsx` provides a **client-side-only, OWNER-accessible** "Viewing as" selector, persisted to `localStorage`. It re-labels/re-orders nav — **it never touches `session.role` or makes an authorization decision.** This boundary is intentional and must not be blurred: perspective is a display convenience, the 5-role backend model is the only real access-control mechanism.

## 5. Mock/adapter layer

Because the backend is treated as a black box and several capabilities in this redesign's brief don't exist there yet (housekeeping, maintenance, front-desk check-in/out, loyalty/CRM, multi-property rollup, admin console, HR/payroll, and several executive-dashboard widgets), those are implemented as fully-designed, working frontend features backed by **deterministic seeded mock data** rather than left unbuilt.

- `lib/adapters/config.ts` — the single source of truth for what's real vs. mocked (`CAPABILITIES` registry).
- `lib/adapters/seed.ts` — a shared seeded PRNG (`seededRandom`) so mock data is stable per branch/day instead of jumping on every render.
- `lib/adapters/<domain>/{types.ts,mock.ts,index.ts}` — one folder per domain. `index.ts` is the only thing pages import; it branches on the registry today and would call `apiFetchAuthed` once a real endpoint exists — **the page never needs to change.**

`housekeeping` (`lib/adapters/housekeeping/`, route `/housekeeping`) is the reference implementation of this pattern — copy its structure for any new mocked domain.

Every mock-sourced screen/widget carries a `<DataSourceBadge source="mock" />` (or `"beta"` for real-endpoint features whose underlying model is trained on synthetic data — restaurant demand, staffing forecasts — per `docs/business_gap_analysis.md`). Mock-only nav items get a small violet dot in the sidebar. This is the core mechanism preventing the UI from overclaiming backend capability.

## 6. AI Assistant states

The assistant (`components/assistant/ChatWindow.tsx`) has three explicit states instead of an ad hoc subtitle string: `generation` (LLM answered normally), `retrieval-only` (current production reality — LLM disabled, shown via a persistent `Alert` plus a visually distinct "Retrieved sources" card instead of a normal chat bubble), and an error state with retry. Sources/citations are always visible, never hidden behind a click — the point of retrieval-only mode is transparency about what's real.

## 7. Future backend integration points

To promote a mocked domain to real once the backend ships it:
1. Flip its key in `lib/adapters/config.ts` from `"mock"` to `"real"`.
2. In that domain's `index.ts`, branch on the flag and call `apiFetchAuthed` against the new endpoint, matching the existing `types.ts` shape (or updating it to match the real API contract).
3. No page or component changes should be required — this is the contract the whole layer is built around.

## 8. Accessibility

Radix primitives (Dialog, Sheet, DropdownMenu, Tabs) provide focus trapping, `Escape`-to-close, and correct ARIA roles out of the box. All interactive elements use `focus-visible:ring-2 focus-visible:ring-ring` for a consistent, high-contrast focus indicator in both themes. Status/data-source information is never conveyed by color alone — `Badge` and `DataSourceBadge` always pair color with a text label or icon.
