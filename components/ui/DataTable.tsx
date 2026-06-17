interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm">
      <table className="min-w-full divide-y divide-[var(--border)]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-sm text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-[var(--foreground)]">
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
