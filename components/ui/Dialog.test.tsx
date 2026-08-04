import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("renders title/description and confirms", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <Dialog
        open
        onClose={onClose}
        title="Apply price"
        description="Are you sure?"
        confirmLabel="Apply"
        onConfirm={onConfirm}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Apply price")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape and cancel click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Confirm" />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("does not render when closed", () => {
    render(<Dialog open={false} onClose={vi.fn()} title="Confirm" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
