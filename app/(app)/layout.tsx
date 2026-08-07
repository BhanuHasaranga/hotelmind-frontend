import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/auth/session";

// Auth gate lives here (Node.js runtime, server component) rather than in
// proxy.ts: Next.js 16 runs proxy.ts on the Node.js runtime by default, but
// Netlify's edge-function bundler (@netlify/plugin-nextjs v5.15.13) still
// packages it as an Edge Function and can't resolve the Node-runtime chunk
// output, which fails the build. This layout-level check gives every route
// under (app) the same protection without an edge artifact for Netlify to
// bundle. See docs/frontend_design_system.md for more.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={session?.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 space-y-6 overflow-y-auto py-6">{children}</main>
      </div>
    </div>
  );
}
