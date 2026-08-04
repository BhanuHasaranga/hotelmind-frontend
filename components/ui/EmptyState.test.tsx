import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title, description, and action", () => {
    render(
      <EmptyState
        title="No data yet"
        description="Come back later"
        action={<button>Retry</button>}
      />
    );
    expect(screen.getByText("No data yet")).toBeInTheDocument();
    expect(screen.getByText("Come back later")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
