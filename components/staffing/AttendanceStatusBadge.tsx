import { Badge } from "@/components/ui/Badge";
import type { Attendance } from "@/lib/types/staff";

const VARIANT: Record<Attendance["status"], "success" | "danger" | "warning" | "neutral"> = {
  PRESENT: "success",
  ABSENT: "danger",
  LATE: "warning",
  HALF_DAY: "neutral",
};

export function AttendanceStatusBadge({ status }: { status: Attendance["status"] }) {
  return <Badge label={status} variant={VARIANT[status]} />;
}
