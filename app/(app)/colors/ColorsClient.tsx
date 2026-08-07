"use client";

import { useState } from "react";
import { Sparkles, Search, TrendingUp, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { Icon } from "@/components/ui/Icon";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { CHART, SERIES } from "@/lib/chart-colors";
import { cn } from "@/lib/utils";

/* ── Section scaffolding ───────────────────────────────────────────────── */

function Section({ id, title, blurb, children }: { id: string; title: string; blurb?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {blurb && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{blurb}</p>}
      </div>
      {children}
    </section>
  );
}

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>;
}

/* ── Brand swatches ────────────────────────────────────────────────────── */

const BRAND_COLORS = [
  {
    name: "British Racing Green",
    hex: "#0B3D2E",
    token: "--color-brand-primary",
    usage: "Primary actions, active indicators, brand identity, primary chart series.",
    role: "Light: interaction & identity — never a large background. Dark: deepens to a surface tone.",
    example: "Primary button, active nav indicator, KPI value",
  },
  {
    name: "Secondary Green",
    hex: "#145A43",
    token: "--color-brand-secondary",
    usage: "Hover states, secondary interactive states, supporting chart series.",
    role: "Light: hover on primary. Dark: becomes the primary interactive fill.",
    example: "Primary button hover, secondary series",
  },
  {
    name: "Light Green",
    hex: "#E8F1ED",
    token: "--color-brand-light",
    usage: "Selected nav, soft cards, KPI icon chips, AI insight surfaces, hover backgrounds, active filters.",
    role: "Light: used heavily as the soft grouping surface. Dark: replaced by a deep green surface.",
    example: "Active nav item, AI insight panel",
  },
  {
    name: "Champagne",
    hex: "#C9A96E",
    token: "--color-brand-accent",
    usage: "Premium indicators, executive metrics, AI intelligence highlights, forecast series. Accent only.",
    role: "Both themes: sparing emphasis. In dark it also serves as the focus ring.",
    example: "Revenue KPI chip, forecast line, AI button edge",
  },
  {
    name: "Deep Green",
    hex: "#071F18",
    token: "--color-brand-deep",
    usage: "Dark-theme background, very high-contrast areas.",
    role: "Light: not used as a background. Dark: the page background.",
    example: "Dark theme page background",
  },
];

function SwatchCard({ c }: { c: (typeof BRAND_COLORS)[number] }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 w-full" style={{ backgroundColor: c.hex }} />
      <CardContent className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{c.name}</p>
          <code className="font-mono text-xs uppercase text-muted-foreground">{c.hex}</code>
        </div>
        <code className="block font-mono text-[11px] text-primary">{c.token}</code>
        <p className="text-xs text-muted-foreground">{c.usage}</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Theme role: </span>
          {c.role}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Example: </span>
          {c.example}
        </p>
      </CardContent>
    </Card>
  );
}

/* ── Sample data (illustrative only — this page never calls the API) ───── */

const OCCUPANCY_TREND = [
  { date: "Mon", occupancy: 72, forecast: 74 },
  { date: "Tue", occupancy: 78, forecast: 77 },
  { date: "Wed", occupancy: 81, forecast: 80 },
  { date: "Thu", occupancy: 76, forecast: 79 },
  { date: "Fri", occupancy: 88, forecast: 87 },
  { date: "Sat", occupancy: 94, forecast: 92 },
  { date: "Sun", occupancy: 85, forecast: 86 },
];

const ADR_REVPAR = [
  { month: "Jan", adr: 182, revpar: 131 },
  { month: "Feb", adr: 191, revpar: 142 },
  { month: "Mar", adr: 205, revpar: 158 },
  { month: "Apr", adr: 198, revpar: 151 },
  { month: "May", adr: 214, revpar: 172 },
];

const CHANNEL_MIX = [
  { channel: "Direct", bookings: 412, revenue: 88_400 },
  { channel: "OTA", bookings: 356, revenue: 71_200 },
  { channel: "Corporate", bookings: 198, revenue: 46_900 },
];

interface ResRow {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  nights: number;
  adr: string;
  status: string;
}

const RESERVATIONS: ResRow[] = [
  { id: "1", guest: "A. Fernando", room: "412 · Deluxe King", checkIn: "12 Aug", nights: 3, adr: "$212", status: "CONFIRMED" },
  { id: "2", guest: "M. Perera", room: "208 · Twin", checkIn: "12 Aug", nights: 1, adr: "$164", status: "CHECKED_IN" },
  { id: "3", guest: "S. Wijesinghe", room: "701 · Suite", checkIn: "13 Aug", nights: 5, adr: "$388", status: "PENDING" },
  { id: "4", guest: "R. Kumar", room: "115 · Standard", checkIn: "13 Aug", nights: 2, adr: "$149", status: "CANCELLED" },
];

const RES_COLUMNS = [
  { key: "guest", header: "Guest" },
  { key: "room", header: "Room" },
  { key: "checkIn", header: "Check-in" },
  { key: "nights", header: "Nights" },
  { key: "adr", header: "ADR" },
  { key: "status", header: "Status", render: (r: ResRow) => <Badge label={r.status} /> },
];

/* ── Page ──────────────────────────────────────────────────────────────── */

export function ColorsClient() {
  const [checked, setChecked] = useState(true);
  const [toggled, setToggled] = useState(true);

  return (
    <div className="space-y-12 pb-16">
      {/* 1 — Brand identity */}
      <Section
        id="identity"
        title="Brand identity"
        blurb="HotelMind is an AI-powered hospitality revenue, operations and guest intelligence platform. The design language is built for hotel managers and executives: premium, calm, and legible — a hospitality command center, not a technical monitoring console."
      >
        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon name="brand" size={26} />
              </span>
              <div>
                <p className="text-lg font-bold text-foreground">HotelMind AI</p>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Hospitality Revenue, Operations &amp; Guest Intelligence
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-accent p-4">
                <p className="text-sm font-semibold text-primary">Why British Racing Green</p>
                <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                  <li>· Luxury</li>
                  <li>· Hospitality</li>
                  <li>· Trust</li>
                  <li>· Sophistication</li>
                  <li>· Timelessness</li>
                </ul>
              </div>
              <div className="rounded-xl border border-[var(--color-brand-accent)]/30 bg-[color-mix(in_srgb,var(--color-brand-accent)_10%,transparent)] p-4">
                <p className="text-sm font-semibold text-[var(--color-brand-accent)]">Why Champagne</p>
                <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                  <li>· Premium experience</li>
                  <li>· Elegance</li>
                  <li>· Executive quality</li>
                  <li>· Hospitality</li>
                </ul>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Brand personality</p>
              <Row className="mt-2">
                {["Premium", "Executive", "Intelligent", "Calm", "Professional", "Approachable"].map((t) => (
                  <Badge key={t} label={t} variant="outline" />
                ))}
              </Row>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* 2 — Core colors */}
      <Section
        id="core"
        title="Core colors"
        blurb="Five brand constants. These carry identity; they do not change between themes — theme-dependent roles are expressed through semantic tokens that consume them."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {BRAND_COLORS.map((c) => (
            <SwatchCard key={c.hex} c={c} />
          ))}
        </div>
      </Section>

      {/* 3 — Light theme hierarchy */}
      <Section
        id="light"
        title="Light theme — the default"
        blurb="HotelMind opens light, always. Green supplies identity and hierarchy; it never becomes the dominant surface. Note the layering: the page is near-white, cards are white, green appears only as soft grouping and as interaction."
      >
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Page background · #F7F9F7
          </p>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Card · #FFFFFF
            </p>
            <div className="rounded-lg bg-accent p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                Soft green surface · #E8F1ED
              </p>
              <Row>
                <Button>Dark green interaction</Button>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-brand-accent)]/40 bg-[color-mix(in_srgb,var(--color-brand-accent)_14%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--color-brand-accent)]">
                  <Sparkles className="h-3 w-3" /> Champagne highlight
                </span>
              </Row>
            </div>
          </div>
        </div>
      </Section>

      {/* 4 — Semantic colors */}
      <Section
        id="semantic"
        title="Semantic colors"
        blurb="Semantic colors are deliberately independent of the brand palette. The brand controls identity; these communicate meaning. Success is a brighter, cooler green than British Racing Green precisely so a CONFIRMED badge never reads as a brand element."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
            <CardContent>
              <Row>
                <Badge label="AVAILABLE" />
                <Badge label="CONFIRMED" />
                <Badge label="CHECKED_IN" />
                <Badge label="PENDING" />
                <Badge label="CANCELLED" />
                <Badge label="NO_SHOW" />
                <Badge label="Neutral" variant="neutral" />
                <Badge label="Preview data" variant="mock" />
              </Row>
              <p className="mt-3 text-xs text-muted-foreground">
                Soft backgrounds with dark text, never saturated fills. Status is always paired with a text
                label, so meaning never depends on color alone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Alerts &amp; notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Alert variant="info" icon={<Info className="h-4 w-4" />} title="Rate parity check complete">
                No discrepancies found across 4 channels.
              </Alert>
              <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />} title="Occupancy below forecast">
                Saturday is tracking 6% under the predicted occupancy rate.
              </Alert>
              <Alert variant="destructive" icon={<AlertTriangle className="h-4 w-4" />} title="Overbooking risk">
                3 more confirmed reservations than available rooms on 14 Aug.
              </Alert>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Status indicators &amp; inline validation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Row className="gap-6">
              {[
                { label: "Operational", cls: "bg-[var(--color-success-fg)]" },
                { label: "Degraded", cls: "bg-[var(--color-warning-fg)]" },
                { label: "Outage", cls: "bg-[var(--color-danger-fg)]" },
                { label: "Informational", cls: "bg-[var(--color-info-fg)]" },
              ].map((s) => (
                <span key={s.label} className="inline-flex items-center gap-2 text-sm text-foreground">
                  <span className={cn("h-2 w-2 rounded-full", s.cls)} />
                  {s.label}
                </span>
              ))}
            </Row>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Rack rate</label>
                <input
                  defaultValue="-40"
                  aria-invalid
                  className="w-full rounded-lg border border-[var(--color-danger-fg)] bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger-fg)]/40"
                />
                <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-danger-fg)]">
                  <AlertTriangle className="h-3 w-3" /> Rate must be greater than zero.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Rack rate</label>
                <input
                  defaultValue="212"
                  className="w-full rounded-lg border border-[var(--color-success-fg)] bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-success-fg)]/40"
                />
                <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-success-fg)]">
                  <CheckCircle2 className="h-3 w-3" /> Within guardrail range.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* 5 — Typography */}
      <Section id="type" title="Typography" blurb="Body text uses dark neutral ink, not brand green. Brand green is reserved for brand-level text and interaction.">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Page title · 24px semibold</p>
              <p className="text-2xl font-semibold text-foreground">Revenue Performance</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Section title · 18px semibold</p>
              <p className="text-lg font-semibold text-foreground">Occupancy &amp; Forecast</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Card title · 14px semibold</p>
              <p className="text-sm font-semibold text-foreground">Guest Satisfaction</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Body · 14px</p>
              <p className="text-sm text-foreground">
                Occupancy is tracking 4.2 points above the same period last year, driven by direct bookings.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Secondary · 14px</p>
              <p className="text-sm text-muted-foreground">Compared with the trailing 30-day average.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">KPI number · 30px bold tabular</p>
              <p className="text-3xl font-bold tabular-nums text-foreground">86.4%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Brand text</p>
              <p className="text-sm font-semibold text-primary">HotelMind Intelligence</p>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* 6 — KPI cards */}
      <Section
        id="kpi"
        title="KPI cards"
        blurb="Always a white card with dark text and a soft icon chip. Cards do not get individual bright backgrounds — the grid should read as one calm surface. Champagne marks the executive/revenue metric."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Occupancy Rate" value="86.4%" sub="211 / 244 rooms" icon="hotel" accent="brand" trend={{ direction: "up", label: "4.2 pts" }} />
          <StatCard label="Revenue Today" value="$48,210" sub="MTD: $1.24M" icon="revenue" accent="premium" trend={{ direction: "up", label: "6.1%" }} />
          <StatCard label="ADR" value="$214" sub="Average daily rate" icon="pricing" accent="brand" trend={{ direction: "flat", label: "0.3%" }} />
          <StatCard label="RevPAR" value="$172" sub="Revenue per available room" icon="reports" accent="success" trend={{ direction: "up", label: "5.4%" }} />
        </div>
      </Section>

      {/* 7 — Buttons */}
      <Section id="buttons" title="Buttons">
        <Card>
          <CardContent className="space-y-4">
            <Row>
              <Button variant="primary">Save changes</Button>
              <Button variant="secondary">Cancel</Button>
              <Button variant="ghost">Reset filters</Button>
              <Button variant="outline">Export CSV</Button>
              <Button variant="danger">Cancel reservation</Button>
              <Button variant="ai">
                <Sparkles /> Generate AI forecast
              </Button>
            </Row>
            <p className="text-xs text-muted-foreground">
              The <code className="font-mono text-primary">ai</code> variant is reserved for genuine AI /
              premium actions. Ordinary CRUD never gets a gold-accented button.
            </p>
            <Row>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </Row>
          </CardContent>
        </Card>
      </Section>

      {/* 8 — Cards */}
      <Section id="cards" title="Cards">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Standard card</CardTitle>
                <CardDescription>White surface, light border, subtle shadow</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              The default container for everything in the application.
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" /> AI insight card
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80">
              Soft green surface marks AI-generated intelligence — recognizable, still clearly HotelMind.
            </CardContent>
          </Card>

          <Card className="border-[var(--color-brand-accent)]/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-[var(--color-brand-accent)]">Premium card</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A champagne edge signals executive-level content without flooding the card with gold.
            </CardContent>
          </Card>

          <Card className="border-[var(--color-warning-fg)]/30 bg-[var(--color-warning-bg)]">
            <CardHeader>
              <CardTitle className="text-[var(--color-warning-fg)]">Warning card</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-warning-fg)]/90">
              Two rooms are out of service beyond their scheduled maintenance window.
            </CardContent>
          </Card>

          <Card className="border-dashed border-mock-foreground/30 bg-mock/40">
            <CardHeader>
              <CardTitle className="text-mock-foreground">Preview / simulated data</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80">
              Violet is reserved for simulated data and is deliberately never merged into the champagne
              accent — &ldquo;preview&rdquo; and &ldquo;premium&rdquo; must stay distinguishable.
            </CardContent>
          </Card>

          <div className="md:col-span-2 xl:col-span-3">
            <Alert
              variant="preview"
              icon={<Sparkles className="h-4 w-4" />}
              title="Preview module"
            >
              The page-level preview banner uses the soft brand green so a persistent, full-width
              notice stays calm. The violet <code className="font-mono">mock</code> marker still does
              the honest work at the point of use — see the &ldquo;Simulated preview&rdquo; badge and
              the sidebar dot.
            </Alert>
          </div>
        </div>
      </Section>

      {/* 9 — Navigation */}
      <Section id="nav" title="Navigation states" blurb="The sidebar is a light surface. Active items use a soft green fill with dark green text plus a brand-green left bar, so selection is never signalled by color alone.">
        <Card className="max-w-sm">
          <CardContent className="space-y-1 bg-sidebar">
            {[
              { label: "Dashboard", icon: "dashboard" as const, state: "active" },
              { label: "Reservations", icon: "bookings" as const, state: "hover" },
              { label: "Pricing Intelligence", icon: "pricing" as const, state: "default" },
              { label: "Portfolio Rollup", icon: "portfolio" as const, state: "disabled" },
            ].map((it) => (
              <div
                key={it.label}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  it.state === "active" &&
                    "bg-sidebar-primary font-semibold text-sidebar-primary-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-primary before:content-['']",
                  it.state === "hover" && "bg-sidebar-accent text-sidebar-accent-foreground",
                  it.state === "default" && "text-sidebar-foreground",
                  it.state === "disabled" && "text-muted-foreground/50",
                )}
              >
                <Icon name={it.icon} size={18} />
                <span className="flex-1">{it.label}</span>
                <span className="text-[10px] uppercase tracking-wide opacity-60">{it.state}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      {/* 10 — Forms */}
      <Section id="forms" title="Forms" blurb="White inputs, light neutral borders, brand-green focus ring.">
        <Card>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ds-guest" className="mb-1 block text-sm font-medium text-foreground">Guest name</label>
              <input
                id="ds-guest"
                placeholder="e.g. A. Fernando"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
            <div>
              <label htmlFor="ds-type" className="mb-1 block text-sm font-medium text-foreground">Room type</label>
              <select
                id="ds-type"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                <option>Deluxe King</option>
                <option>Twin</option>
                <option>Suite</option>
              </select>
            </div>
            <div>
              <label htmlFor="ds-search" className="mb-1 block text-sm font-medium text-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="ds-search"
                  placeholder="Search reservations"
                  className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </div>
            </div>
            <div>
              <label htmlFor="ds-date" className="mb-1 block text-sm font-medium text-foreground">Check-in date</label>
              <input
                id="ds-date"
                type="date"
                defaultValue="2026-08-12"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[var(--primary)]"
              />
              Include cancelled reservations
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={toggled}
                onClick={() => setToggled((v) => !v)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  toggled ? "bg-primary" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform",
                    toggled ? "translate-x-[22px]" : "translate-x-0.5",
                  )}
                />
              </button>
              <span className="text-sm text-foreground">Auto-apply AI pricing</span>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* 11 — Table */}
      <Section id="table" title="Reservations table" blurb="Predominantly white, subtle borders, breathable rows, green status indicators.">
        <DataTable<ResRow>
          columns={RES_COLUMNS}
          data={RESERVATIONS}
          keyExtractor={(r) => r.id}
        />
      </Section>

      {/* 12 — Charts */}
      <Section
        id="charts"
        title="Data visualization"
        blurb="Brand green leads; champagne marks forecast and AI-derived series. Multi-series charts draw from a validated categorical scale rather than green tints, so series stay distinguishable — including for colorblind readers."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Occupancy vs AI Forecast</CardTitle>
                <CardDescription>Actual in brand green, forecast in champagne</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <TrendLineChart
                data={OCCUPANCY_TREND}
                xKey="date"
                height={240}
                series={[
                  { key: "occupancy", label: "Occupancy %", color: CHART.primary },
                  { key: "forecast", label: "AI forecast %", color: CHART.highlight },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>ADR vs RevPAR</CardTitle>
                <CardDescription>Primary and secondary brand greens</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <BarComparisonChart
                data={ADR_REVPAR}
                xKey="month"
                height={240}
                series={[
                  { key: "adr", label: "ADR ($)", color: CHART.primary },
                  { key: "revpar", label: "RevPAR ($)", color: CHART.secondary },
                ]}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Booking channel comparison</CardTitle>
                <CardDescription>
                  Multi-series charts use the validated categorical scale — distinguishable hues, not green tints
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <BarComparisonChart
                data={CHANNEL_MIX}
                xKey="channel"
                height={240}
                series={[
                  { key: "bookings", label: "Bookings", color: SERIES[0] },
                  { key: "revenue", label: "Revenue ($)", color: SERIES[1] },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* 13 — AI components */}
      <Section
        id="ai"
        title="AI &amp; intelligence"
        blurb="AI surfaces use the soft green surface with brand-green headings, and champagne for premium emphasis — connected to HotelMind, never looking like a separate product."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-primary/20 bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" /> AI Revenue Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/85">
                Revenue is projected to reach <span className="font-semibold text-primary">$1.42M</span> this
                month, 8.3% above the trailing average.
              </p>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Model confidence</span>
                  <span className="font-medium text-[var(--color-brand-accent)]">High · 92%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-card">
                  <div className="h-full rounded-full bg-[var(--color-brand-accent)]" style={{ width: "92%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-4 w-4" /> Revenue Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/85">
                Increase Deluxe King rate by <span className="font-semibold text-primary">$18</span> for
                Fri&ndash;Sat. Demand is outpacing the comparable set.
              </p>
              <Row>
                <Button variant="ai" size="sm"><Sparkles /> Apply recommendation</Button>
                <Button variant="ghost" size="sm">Dismiss</Button>
              </Row>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="ai" size={16} className="text-primary" /> Occupancy Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold tabular-nums text-primary">91.2%</p>
              <p className="text-xs text-muted-foreground">Predicted for Saturday 16 Aug · ±3.1 pts</p>
            </CardContent>
          </Card>

          <Alert
            variant="warning"
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Anomaly detected — Restaurant Revenue"
          >
            Tuesday covers fell 34% below the seasonal expectation. Staff utilization was unchanged, which
            rules out a scheduling cause.
          </Alert>
        </div>
      </Section>

      {/* 14 — Dark theme */}
      <Section
        id="dark"
        title="Dark theme"
        blurb="A deliberate premium dark theme built on Deep Green — not an inversion of the light theme. Dark is opt-in; use the theme toggle in the user menu to compare the full application. The preview below is always rendered dark, whichever theme you are currently in."
      >
        <div className="dark rounded-2xl border border-border bg-background p-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Occupancy Rate" value="86.4%" sub="211 / 244 rooms" icon="hotel" accent="brand" trend={{ direction: "up", label: "4.2 pts" }} />
            <StatCard label="Revenue Today" value="$48,210" sub="MTD: $1.24M" icon="revenue" accent="premium" trend={{ direction: "up", label: "6.1%" }} />
            <StatCard label="ADR" value="$214" sub="Average daily rate" icon="pricing" accent="brand" />
            <StatCard label="RevPAR" value="$172" sub="Per available room" icon="reports" accent="success" />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card className="border-primary/30 bg-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--color-brand-accent)]">
                  <Sparkles className="h-4 w-4" /> AI Revenue Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground/85">
                Champagne carries the accent role in dark, where it also serves as the focus ring.
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <Row>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ai"><Sparkles /> AI action</Button>
                </Row>
                <Row>
                  <Badge label="CONFIRMED" />
                  <Badge label="PENDING" />
                  <Badge label="CANCELLED" />
                  <Badge label="Preview data" variant="mock" />
                </Row>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* 15 — Tokens */}
      <Section
        id="tokens"
        title="Design tokens"
        blurb="Components consume tokens, never raw hex. Brand constants live in the @theme block in app/globals.css; theme-dependent roles are redefined under :root and .dark."
      >
        <Card>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-6 font-semibold">Token</th>
                  <th className="py-2 pr-6 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["--color-brand-primary", "British Racing Green — brand constant"],
                  ["--color-brand-secondary", "Secondary green — brand constant"],
                  ["--color-brand-light", "Soft green surface — brand constant"],
                  ["--color-brand-accent", "Champagne — brand constant"],
                  ["--color-brand-deep", "Deep green — brand constant"],
                  ["--background / --card", "Page and card surfaces"],
                  ["--primary / --primary-foreground", "Primary action fill and its text"],
                  ["--secondary / --accent", "Soft green surfaces and hover states"],
                  ["--muted-foreground", "Secondary text"],
                  ["--border / --input / --ring", "Borders, inputs, focus ring"],
                  ["--color-success / warning / danger / info", "Semantic status (independent of brand)"],
                  ["--mock / --mock-foreground", "Simulated-data marker (never reused)"],
                  ["--sidebar*", "Navigation surface, active and hover states"],
                  ["--chart-1 … --chart-5", "Chart series slots"],
                ].map(([token, role]) => (
                  <tr key={token}>
                    <td className="py-2 pr-6"><code className="font-mono text-xs text-primary">{token}</code></td>
                    <td className="py-2 pr-6 text-muted-foreground">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
