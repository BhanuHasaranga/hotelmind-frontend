import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/lib/types/restaurant";

async function getOrders(): Promise<Order[]> {
  try {
    return await apiFetch<Order[]>("/api/v1/restaurant/orders");
  } catch {
    return [];
  }
}

type OrderRow = Order;

const COLUMNS = [
  { key: "id",    header: "Order ID",  render: (r: OrderRow) => r.id.slice(0, 8) + "…" },
  {
    key: "status",
    header: "Status",
    render: (r: OrderRow) => <Badge label={r.status} />,
  },
  {
    key: "opened_at",
    header: "Opened",
    render: (r: OrderRow) => new Date(r.opened_at).toLocaleString(),
  },
  {
    key: "total_amount",
    header: "Total",
    render: (r: OrderRow) => `$${Number(r.total_amount).toLocaleString()}`,
  },
  {
    key: "items",
    header: "Items",
    render: (r: OrderRow) => r.items?.length ?? 0,
  },
];

export default async function RestaurantPage() {
  const orders = await getOrders();

  return (
    <>
      <TopBar title="Restaurant" subtitle="Orders and table management" />

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Open Orders",   value: orders.filter((o) => o.status === "OPEN").length,   color: "text-blue-600" },
            { label: "Closed Today",  value: orders.filter((o) => o.status === "CLOSED").length, color: "text-green-600" },
            { label: "Total Revenue", value: `$${orders.filter((o) => o.status === "CLOSED").reduce((s, o) => s + Number(o.total_amount), 0).toLocaleString()}`, color: "text-purple-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm">
              <p className="text-xs text-gray-400">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <DataTable<OrderRow>
          columns={COLUMNS as never}
          data={orders}
          keyExtractor={(o) => o.id}
          emptyMessage="No orders yet. Open one via POST /api/v1/restaurant/orders"
        />
      </div>
    </>
  );
}
