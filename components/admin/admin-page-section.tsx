import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminSupabaseConfigured } from "@/lib/admin/env";

export function AdminDemoBanner() {
  if (isAdminSupabaseConfigured()) return null;

  return (
    <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
      Supabase is not configured, so this page is showing empty demo data. Add your keys to{" "}
      <code className="rounded bg-background/80 px-1 py-0.5">.env.local</code> to load live
      records.
    </div>
  );
}

export function AdminPageSection({
  title,
  description,
  count,
  children,
}: {
  title: string;
  description?: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      <AdminDemoBanner />
      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {title}
            {typeof count === "number" ? (
              <span className="ml-2 text-sm font-normal text-muted-foreground">({count})</span>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
      <Icon className="mb-3 h-8 w-8 text-muted-foreground/50" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
