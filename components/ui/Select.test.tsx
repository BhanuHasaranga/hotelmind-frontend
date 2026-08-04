import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  it("renders options and fires onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select
        aria-label="fruit"
        options={[
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
        ]}
        onChange={handleChange}
      />
    );
    const select = screen.getByRole("combobox", { name: "fruit" }) as HTMLSelectElement;
    await user.selectOptions(select, "banana");
    expect(handleChange).toHaveBeenCalled();
    expect(select.value).toBe("banana");
  });
});
