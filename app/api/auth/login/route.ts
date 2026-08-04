import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface JwtPayload {
  sub: string;
  role: string;
  branch_id: string | null;
  exp: number;
}

function decodeJwtPayload(token: string): JwtPayload {
  const [, payloadB64] = token.split(".");
  const json = Buffer.from(payloadB64, "base64").toString("utf-8");
  return JSON.parse(json) as JwtPayload;
}

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);

  const loginRes = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!loginRes.ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const { access_token: token } = (await loginRes.json()) as { access_token: string };

  const meRes = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!meRes.ok) {
    return NextResponse.json({ error: "Login succeeded but profile fetch failed" }, { status: 502 });
  }
  const me = (await meRes.json()) as {
    id: string;
    email: string;
    full_name: string;
    role: string;
    branch_id: string | null;
  };

  const { exp } = decodeJwtPayload(token);
  const expiresAt = new Date(exp * 1000);

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    JSON.stringify({
      token,
      userId: me.id,
      email: me.email,
      fullName: me.full_name,
      role: me.role,
      branchId: me.branch_id,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    },
  );

  return NextResponse.json({ role: me.role, fullName: me.full_name });
}
