"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export interface TrendSeries {
  key: string;
  label: string;
  color: string;
}

export interface ConfidenceBand {
  /** Data key holding the upper bound value */
  upperKey: string;
  /** Data key holding the lower bound value */
  lowerKey: string;
  color: string;
  label?: string;
}

/**
 * Recharts has no native band/area-between-two-lines primitive, so we derive
 * a synthetic "band width" series (upper - lower) and stack it on top of an
 * invisible base area anchored at the lower bound. The base area is fully
 * transparent; only the band-width area is filled, producing a shaded region
 * between the two bounds.
 */
function withBandFields<T extends Record<string, unknown>>(data: T[], band?: ConfidenceBand) {
  if (!band) return data;
  return data.map((row) => {
    const lower = Number(row[band.lowerKey] ?? 0);
    const upper = Number(row[band.upperKey] ?? 0);
    return { ...row, __bandBase: lower, __bandWidth: Math.max(upper - lower, 0) };
  });
}

interface TrendLineChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  series: TrendSeries[];
  band?: ConfidenceBand;
  height?: number;
  gridColor?: string;
  axisColor?: string;
}

const DEFAULT_GRID_COLOR = "#94a3b8";
const DEFAULT_AXIS_COLOR = "#94a3b8";

export function TrendLineChart({
  data,
  xKey,
  series,
  band,
  height = 320,
  gridColor = DEFAULT_GRID_COLOR,
  axisColor = DEFAULT_AXIS_COLOR,
}: TrendLineChartProps) {
  const chartData = withBandFields(data, band);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={gridColor} strokeOpacity={0.25} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: axisColor, fontSize: 12 }}
          axisLine={{ stroke: gridColor, strokeOpacity: 0.4 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: axisColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {band && (
          <>
            <Area
              dataKey="__bandBase"
              stackId="confidence-band"
              stroke="none"
              fill="transparent"
              legendType="none"
              isAnimationActive={false}
              tooltipType="none"
            />
            <Area
              dataKey="__bandWidth"
              stackId="confidence-band"
              stroke="none"
              fill={band.color}
              fillOpacity={0.15}
              name={band.label ?? "Confidence interval"}
              isAnimationActive={false}
            />
          </>
        )}
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
