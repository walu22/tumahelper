import type { LucideIcon } from "lucide-react";

interface WorkerStatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "green" | "amber" | "blue";
}

const toneStyles = {
  primary: "bg-primary/10 text-primary",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-sky-100 text-sky-700",
};

export function WorkerStatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: WorkerStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold mt-1 capitalize">{value}</p>
          {hint ? (
            <p className="text-xs text-muted-foreground mt-1">{hint}</p>
          ) : null}
        </div>
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${toneStyles[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
