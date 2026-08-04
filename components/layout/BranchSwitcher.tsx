"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Select";

interface BranchOption {
  id: string;
  name: string;
  hotelName: string;
}

interface BranchSwitcherProps {
  branches: BranchOption[];
  activeBranchId: string | null;
}

const BRANCH_COOKIE_NAME = "hotelmind_active_branch";

export function BranchSwitcher({ branches, activeBranchId }: BranchSwitcherProps) {
  const router = useRouter();

  if (branches.length === 0) return null;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const branchId = e.target.value;
    document.cookie = `${BRANCH_COOKIE_NAME}=${branchId}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    router.refresh();
  }

  return (
    <Select
      size="sm"
      value={activeBranchId ?? ""}
      onChange={handleChange}
      options={[
        { value: "", label: "Select a branch…", disabled: true },
        ...branches.map((b) => ({ value: b.id, label: `${b.hotelName} — ${b.name}` })),
      ]}
      className="min-w-[220px]"
    />
  );
}
