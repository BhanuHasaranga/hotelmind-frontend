import { TopBar } from "@/components/layout/TopBar";
import { ColorsClient } from "./ColorsClient";

// Internal design-system reference, not a normal application page: everything
// it renders is illustrative and hardcoded, so it makes no API calls and has
// no data-source badge. It lives inside the (app) group deliberately, so the
// components are shown in the real application chrome.
export default function ColorsPage() {
  return (
    <>
      <TopBar
        title="HotelMind Design System"
        subtitle="Brand identity, color, components and data visualization"
      />
      <div className="mt-6">
        <ColorsClient />
      </div>
    </>
  );
}
