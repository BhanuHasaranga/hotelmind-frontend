"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";

/**
 * "Perspective" is a UI-only convenience filter for personas the backend has
 * no real role for (CEO, GM, Front Office Manager, ...). It NEVER changes
 * session.role, never affects which API calls are authorized, and never
 * grants access to data the real 5-role backend model wouldn't already
 * allow — it only reorders/collapses nav groups for OWNER sessions to
 * simulate what a role-tailored experience would emphasize.
 */
export const PERSPECTIVES = [
  { id: "executive", label: "Executive / Owner View" },
  { id: "gm", label: "General Manager View" },
  { id: "front-office", label: "Front Office View" },
  { id: "revenue", label: "Revenue Manager View" },
  { id: "operations", label: "Operations View" },
] as const;

export type PerspectiveId = (typeof PERSPECTIVES)[number]["id"];

const STORAGE_KEY = "hotelmind.perspective";

export function usePerspective(enabled: boolean): [PerspectiveId, (id: PerspectiveId) => void] {
  const [perspective, setPerspectiveState] = useState<PerspectiveId>("executive");

  useEffect(() => {
    if (!enabled) return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as PerspectiveId | null;
    if (stored && PERSPECTIVES.some((p) => p.id === stored)) {
      setPerspectiveState(stored);
    }
  }, [enabled]);

  function setPerspective(id: PerspectiveId) {
    setPerspectiveState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
    window.dispatchEvent(new CustomEvent("hotelmind:perspective-change", { detail: id }));
  }

  return [perspective, setPerspective];
}

interface PerspectiveSelectorProps {
  value: PerspectiveId;
  onChange: (id: PerspectiveId) => void;
  className?: string;
}

export function PerspectiveSelector({ value, onChange, className }: PerspectiveSelectorProps) {
  const current = PERSPECTIVES.find((p) => p.id === value) ?? PERSPECTIVES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-secondary",
          className,
        )}
      >
        {current.label}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Viewing as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PERSPECTIVES.map((p) => (
          <DropdownMenuItem key={p.id} onSelect={() => onChange(p.id)} className={p.id === value ? "bg-secondary" : ""}>
            {p.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
