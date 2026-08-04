import { UserMenu } from "@/components/layout/UserMenu";
import { BranchSwitcher } from "@/components/layout/BranchSwitcher";
import { getSession } from "@/lib/auth/session";
import { listAllBranches, resolveActiveBranchId } from "@/lib/auth/branch";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export async function TopBar({ title, subtitle }: TopBarProps) {
  const session = await getSession();
  const isOwner = session?.role === "OWNER";
  const branches = isOwner && session ? await listAllBranches(session.token) : [];
  const activeBranchId = session ? await resolveActiveBranchId(session) : null;

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card-bg)] px-6">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {isOwner && <BranchSwitcher branches={branches} activeBranchId={activeBranchId} />}
        <UserMenu fullName={session?.fullName} role={session?.role} />
      </div>
    </header>
  );
}
