import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";
import type { Hotel } from "@/lib/types/hotel";

async function getHotels(): Promise<Hotel[]> {
  try {
    return await apiFetch<Hotel[]>("/api/v1/hotels/");
  } catch {
    return [];
  }
}

export default async function HotelsPage() {
  const hotels = await getHotels();

  return (
    <>
      <TopBar title="Hotels" subtitle="All properties" />

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{hotels.length} hotel{hotels.length !== 1 ? "s" : ""}</p>
        </div>

        {hotels.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-16 text-center text-sm text-gray-400 shadow-sm">
            No hotels yet. Add one via the API at <span className="font-mono">POST /api/v1/hotels</span>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <Link key={hotel.id} href={`/hotels/${hotel.id}`} className="block">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)]">{hotel.name}</h3>
                      <p className="text-xs text-gray-400">{hotel.city}, {hotel.country}</p>
                    </div>
                    <Badge label={hotel.is_active ? "AVAILABLE" : "MAINTENANCE"} />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>{"⭐".repeat(hotel.star_rating)}</span>
                    <span>{hotel.branches.length} branch{hotel.branches.length !== 1 ? "es" : ""}</span>
                  </div>
                  {hotel.branches.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {hotel.branches.slice(0, 2).map((b) => (
                        <p key={b.id} className="text-xs text-gray-400">
                          {b.is_main_branch ? "🏠" : "🔗"} {b.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
