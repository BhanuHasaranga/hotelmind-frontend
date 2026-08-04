import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { apiFetchAuthed } from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import type { Hotel, Room } from "@/lib/types/hotel";

async function getAllRooms(token: string): Promise<(Room & { hotelName: string; branchName: string })[]> {
  try {
    const hotels = await apiFetchAuthed<Hotel[]>("/api/v1/hotels/", token);
    const rows: (Room & { hotelName: string; branchName: string })[] = [];
    await Promise.all(
      hotels.flatMap((hotel) =>
        hotel.branches.map(async (branch) => {
          try {
            const rooms = await apiFetchAuthed<Room[]>(`/api/v1/hotels/branches/${branch.id}/rooms`, token);
            rooms.forEach((r) => rows.push({ ...r, hotelName: hotel.name, branchName: branch.name }));
          } catch {}
        })
      )
    );
    return rows;
  } catch {
    return [];
  }
}

type RoomRow = Room & { hotelName: string; branchName: string };

const COLUMNS = [
  { key: "room_number", header: "Room" },
  { key: "hotelName",   header: "Hotel" },
  { key: "branchName",  header: "Branch" },
  {
    key: "status",
    header: "Status",
    render: (row: RoomRow) => <Badge label={row.status} />,
  },
  {
    key: "room_type",
    header: "Type",
    render: (row: RoomRow) => row.room_type?.name ?? "—",
  },
  {
    key: "room_type_price",
    header: "Base Price",
    render: (row: RoomRow) => row.room_type ? `$${row.room_type.base_price}` : "—",
  },
];

export default async function RoomsPage() {
  const session = await getSession();
  const rooms = session ? await getAllRooms(session.token) : [];

  const byStatus = {
    AVAILABLE:   rooms.filter((r) => r.status === "AVAILABLE").length,
    OCCUPIED:    rooms.filter((r) => r.status === "OCCUPIED").length,
    MAINTENANCE: rooms.filter((r) => r.status === "MAINTENANCE").length,
    CLEANING:    rooms.filter((r) => r.status === "CLEANING").length,
  };

  return (
    <>
      <TopBar title="Rooms" subtitle="All rooms across properties" />

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm text-center">
              <Badge label={status} />
              <p className="mt-2 text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>

        <DataTable<RoomRow>
          columns={COLUMNS as never}
          data={rooms}
          keyExtractor={(r) => r.id}
          emptyMessage="No rooms found. Add hotels and rooms via the API."
        />
      </div>
    </>
  );
}
