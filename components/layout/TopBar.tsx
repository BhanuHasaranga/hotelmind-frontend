interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card-bg)] px-6">
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          H
        </div>
      </div>
    </header>
  );
}
