"use client";

import { PerspectiveSelector, usePerspective } from "@/components/shared/perspective-selector";

export function TopBarPerspective() {
  const [perspective, setPerspective] = usePerspective(true);
  return <PerspectiveSelector value={perspective} onChange={setPerspective} />;
}
