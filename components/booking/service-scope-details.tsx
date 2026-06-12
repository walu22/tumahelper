import type { ServiceScopeRow } from "@/lib/services/utils";

export function ServiceScopeDetails({
  rows,
  className = "",
}: {
  rows: ServiceScopeRow[];
  className?: string;
}) {
  if (rows.length === 0) return null;

  return (
    <dl className={`space-y-2.5 text-sm ${className}`.trim()}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[minmax(4.5rem,5.5rem)_1fr] sm:grid-cols-[5.5rem_1fr] gap-x-3 gap-y-0.5"
        >
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="text-foreground font-medium leading-snug">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
