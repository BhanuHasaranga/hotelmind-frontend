import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ToastProvider, useToast } from "./ToastProvider";

function TestButton() {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast({ title: "Saved", description: "Your change was applied", variant: "success" })
      }
    >
      Show toast
    </button>
  );
}

describe("ToastProvider / useToast", () => {
  it("shows a toast and dismisses it on close click", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestButton />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your change was applied")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(screen.queryByText("Saved")).not.toBeInTheDocument());
  });
});
