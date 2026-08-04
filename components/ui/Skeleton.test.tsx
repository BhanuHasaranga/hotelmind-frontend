import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders with status role and applies size", () => {
    render(<Skeleton width={100} height={20} className="extra-class" />);
    const el = screen.getByRole("status");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("animate-pulse");
    expect(el).toHaveClass("extra-class");
    expect(el).toHaveStyle({ width: "100px", height: "20px" });
  });
});
