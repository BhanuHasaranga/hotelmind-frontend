import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

function ControlledTabs() {
  const [value, setValue] = useState("a");
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Content A</TabsContent>
      <TabsContent value="b">Content B</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("switches content when a different tab is clicked", async () => {
    const user = userEvent.setup();
    render(<ControlledTabs />);
    expect(screen.getByText("Content A")).toBeInTheDocument();
    expect(screen.queryByText("Content B")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Tab B" }));

    expect(screen.getByText("Content B")).toBeInTheDocument();
    expect(screen.queryByText("Content A")).not.toBeInTheDocument();
  });
});
