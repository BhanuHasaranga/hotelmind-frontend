import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { apiFetchAuthed } from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import type { Hotel } from "@/lib/types/hotel";
import type { Room } from "@/lib/types/hotel";

async function getHotel(id: string, token: string): Promise<Hotel | null> {
  try {
    return await apiFetchAuthed<Hotel>(`/api/v1/hotels/${id}`, token);
  } catch {
    return null;
  }
}

async function getRooms(branchId: string, token: string): Promise<Room[]> {
  try {
    return await apiFetchAuthed<Room[]>(`/api/v1/hotels/branches/${branchId}/rooms`, token);
  } catch {
    return [];
  }
}

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE:   "bg-green-100 border-green-300 dark:bg-green-900",
  OCCUPIED:    "bg-blue-100 border-blue-300 dark:bg-blue-900",
  MAINTENANCE: "bg-amber-100 border-amber-300 dark:bg-amber-900",
  CLEANING:    "bg-purple-100 border-purple-300 dark:bg-purple-900",
};

export default async function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return (
      <>
        <TopBar title="Not signed in" />
      </>
    );
  }

  const hotel = await getHotel(id, session.token);

  if (!hotel) {
    return (
      <>
        <TopBar title="Hotel Not Found" />
        <p className="mt-6 text-sm text-muted-foreground">No hotel with this ID exists.</p>
      </>
    );
  }

  const mainBranch = hotel.branches.find((b) => b.is_main_branch) ?? hotel.branches[0];
  const rooms = mainBranch ? await getRooms(mainBranch.id, session.token) : [];

  return (
    <>
      <TopBar title={hotel.name} subtitle={`${hotel.city}, ${hotel.country} · ${"⭐".repeat(hotel.star_rating)}`} />

      <div className="mt-6 space-y-6">
        {/* Hotel details */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-xs">Address</p>
              <p className="font-medium">{hotel.address}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Phone</p>
              <p className="font-medium">{hotel.phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Email</p>
              <p className="font-medium">{hotel.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Branches</p>
              <p className="font-medium">{hotel.branches.length}</p>
            </div>
          </div>
        </div>

        {/* Room grid */}
        {rooms.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Room Status — {mainBranch?.name}
            </h2>

            {/* Legend */}
            <div className="mb-4 flex flex-wrap gap-3 text-xs">
              {["AVAILABLE", "OCCUPIED", "MAINTENANCE", "CLEANING"].map((s) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={`inline-block h-3 w-3 rounded border ${STATUS_COLOR[s]}`} />
                  {s}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  title={`Room ${room.room_number} — ${room.status}`}
                  className={`flex h-14 flex-col items-center justify-center rounded-lg border text-xs font-semibold transition-transform hover:scale-105 ${STATUS_COLOR[room.status] ?? "bg-gray-100"}`}
                >
                  <span>{room.room_number}</span>
                  <span className="text-[10px] font-normal opacity-70">{room.status.slice(0, 4)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
