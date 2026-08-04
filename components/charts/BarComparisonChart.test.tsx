import { render } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { BarComparisonChart } from "./BarComparisonChart";

const data = [
  { meal: "Breakfast", recommended: 40, actual: 35 },
  { meal: "Lunch", recommended: 80, actual: 75 },
  { meal: "Dinner", recommended: 100, actual: 92 },
];

describe("BarComparisonChart", () => {
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

  it("renders a chart svg with grouped bar series", () => {
    const { container } = render(
      <BarComparisonChart
        data={data}
        xKey="meal"
        series={[
          { key: "recommended", label: "Recommended", color: "#1d4ed8" },
          { key: "actual", label: "Actual", color: "#16a34a" },
        ]}
      />
    );
    expect(container.querySelector("svg")).toBeTruthy();
  });
});
