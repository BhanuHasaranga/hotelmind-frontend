import { Icon, type IconName } from "./Icon";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: IconName;
  accent?: "blue" | "green" | "amber" | "purple";
}

const ACCENT_MAP = {
  blue:   "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  green:  "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  amber:  "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
};

export function StatCard({ label, value, sub, icon, accent = "blue" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {icon && (
          <span className={`rounded-lg p-2 ${ACCENT_MAP[accent]}`}>
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
