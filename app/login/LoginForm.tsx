"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const DEMO_ACCOUNTS = [
  { role: "Owner", email: "owner@hotelmind.demo" },
  { role: "Revenue Manager", email: "revenue.manager@hotelmind.demo" },
  { role: "Ops Manager", email: "ops.manager@hotelmind.demo" },
  { role: "Restaurant Manager", email: "restaurant.manager@hotelmind.demo" },
  { role: "Guest Experience Manager", email: "guest.experience@hotelmind.demo" },
];

export function LoginForm() {
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <Logo size={24} />
          </div>
          <h1 className="text-xl font-bold text-foreground">HotelMind AI</h1>
          <p className="text-sm text-muted-foreground">Operations Intelligence Platform</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="you@hotelmind.demo"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Demo accounts (password: demo1234)
          </p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.email} className="flex justify-between gap-2">
                <span>{account.role}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword("demo1234");
                  }}
                  className="font-mono text-primary hover:underline"
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
