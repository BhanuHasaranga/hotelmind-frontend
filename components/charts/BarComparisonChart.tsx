"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export interface BarSeries {
  key: string;
  label: string;
  color: string;
}

interface BarComparisonChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  series: BarSeries[];
  height?: number;
  gridColor?: string;
  axisColor?: string;
}

const DEFAULT_GRID_COLOR = "#94a3b8";
const DEFAULT_AXIS_COLOR = "#94a3b8";

export function BarComparisonChart({
  data,
  xKey,
  series,
  height = 320,
  gridColor = DEFAULT_GRID_COLOR,
  axisColor = DEFAULT_AXIS_COLOR,
}: BarComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={gridColor} strokeOpacity={0.25} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: axisColor, fontSize: 12 }}
          axisLine={{ stroke: gridColor, strokeOpacity: 0.4 }}
          tickLine={false}
        />
        <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
        <Tooltip
          contentStyle={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          cursor={{ fill: gridColor, fillOpacity: 0.1 }}
        />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={32} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
