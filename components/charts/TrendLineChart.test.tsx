import { render } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { TrendLineChart } from "./TrendLineChart";
import { CHART } from "@/lib/chart-colors";

const data = [
  { day: "Mon", occupancy: 60, forecastLower: 55, forecastUpper: 65 },
  { day: "Tue", occupancy: 62, forecastLower: 58, forecastUpper: 68 },
  { day: "Wed", occupancy: 70, forecastLower: 64, forecastUpper: 72 },
];

describe("TrendLineChart", () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(600);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(320);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 600,
      height: 320,
      top: 0,
      left: 0,
      bottom: 320,
      right: 600,
      x: 0,
      y: 0,
      toJSON() {
        return this;
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a chart svg with the given series", () => {
    const { container } = render(
      <TrendLineChart
        data={data}
        xKey="day"
        series={[{ key: "occupancy", label: "Occupancy", color: CHART.primary }]}
        band={{ upperKey: "forecastUpper", lowerKey: "forecastLower", color: CHART.highlight }}
      />
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });
});
