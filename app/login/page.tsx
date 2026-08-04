"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

const DEMO_ACCOUNTS = [
  { role: "Owner", email: "owner@hotelmind.demo" },
  { role: "Revenue Manager", email: "revenue.manager@hotelmind.demo" },
  { role: "Ops Manager", email: "ops.manager@hotelmind.demo" },
  { role: "Restaurant Manager", email: "restaurant.manager@hotelmind.demo" },
  { role: "Guest Experience Manager", email: "guest.experience@hotelmind.demo" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Login failed");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--sidebar-active)] text-white">
            <Icon name="brand" size={26} />
          </div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">HotelMind AI</h1>
          <p className="text-sm text-gray-500">Operations Intelligence Platform</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                placeholder="you@hotelmind.demo"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                placeholder="demo1234"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-[var(--color-danger-bg)] px-3 py-2 text-sm text-[var(--color-danger-fg)]">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Demo accounts (password: demo1234)
          </p>
          <ul className="space-y-1 text-xs text-gray-500">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.email} className="flex justify-between gap-2">
                <span>{account.role}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword("demo1234");
                  }}
                  className="font-mono text-[var(--sidebar-active)] hover:underline"
                >
                  {account.email}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
