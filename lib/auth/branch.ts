import "server-only";
import { cookies } from "next/headers";
import { apiFetchAuthed } from "@/lib/api";
import type { Hotel } from "@/lib/types/hotel";
import type { Session } from "@/lib/auth/session";
import { getSession } from "@/lib/auth/session";

const BRANCH_COOKIE_NAME = "hotelmind_active_branch";

/**
 * Resolves which branch the current request should operate on.
 *
 * Non-OWNER roles are pinned to their own branch_id from the session — the
 * backend enforces this too (scope_branch), this is just the UI-side mirror
 * so pages don't need their own switcher logic. OWNER can pick any branch,
 * remembered via a plain (non-httpOnly) cookie so the client-side
 * BranchSwitcher can read/write it directly without a round-trip.
 */
export async function resolveActiveBranchId(session: Session): Promise<string | null> {
  if (session.role !== "OWNER") {
    return session.branchId;
  }

  const store = await cookies();
  return store.get(BRANCH_COOKIE_NAME)?.value ?? null;
}

export async function listAllBranches(token: string): Promise<{ id: string; name: string; hotelName: string }[]> {
  try {
    const hotels = await apiFetchAuthed<Hotel[]>("/api/v1/hotels/", token);
    return hotels.flatMap((hotel) =>
      hotel.branches.map((branch) => ({ id: branch.id, name: branch.name, hotelName: hotel.name })),
    );
  } catch {
    return [];
  }
}

export async function getActiveBranch(): Promise<{ branchId: string | null; session: Session } | null> {
  const session = await getSession();
  if (!session) return null;
  const branchId = await resolveActiveBranchId(session);
  return { branchId, session };
}

export const BRANCH_COOKIE = BRANCH_COOKIE_NAME;
