import "server-only";
import { cookies } from "next/headers";

export interface Session {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  branchId: string | null;
}

const COOKIE_NAME = "hotelmind_session";

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session — this should be unreachable behind proxy.ts's redirect");
  }
  return session;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
