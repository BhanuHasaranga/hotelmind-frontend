import { UserMenu } from "@/components/layout/UserMenu";
import { BranchSwitcher } from "@/components/layout/BranchSwitcher";
import { TopBarPerspective } from "@/components/layout/TopBarPerspective";
import { DataSourceBadge } from "@/components/shared/data-source-badge";
import { getSession } from "@/lib/auth/session";
import { listAllBranches, resolveActiveBranchId } from "@/lib/auth/branch";

interface TopBarProps {
  title: string;
  subtitle?: string;
  dataSource?: "real" | "mock" | "beta";
}

export async function TopBar({ title, subtitle, dataSource }: TopBarProps) {
  const session = await getSession();
  const isOwner = session?.role === "OWNER";
  const branches = isOwner && session ? await listAllBranches(session.token) : [];
  const activeBranchId = session ? await resolveActiveBranchId(session) : null;

  // py-5 mirrors the sidebar brand block so both bottom borders line up.
  return (
    <header className="flex items-center justify-between border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {dataSource && <DataSourceBadge source={dataSource} compact />}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isOwner && <TopBarPerspective />}
        {isOwner && <BranchSwitcher branches={branches} activeBranchId={activeBranchId} />}
        <UserMenu fullName={session?.fullName} role={session?.role} />
      </div>
    </header>
  );
}
