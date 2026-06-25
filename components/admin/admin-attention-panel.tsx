import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminAttentionItem } from "@/lib/admin/dashboard-data";
import { cn } from "@/lib/utils";

const toneStyles: Record<AdminAttentionItem["tone"], string> = {
  warning: "border-amber-200/80 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20",
  destructive: "border-red-200/80 bg-red-50/70 dark:border-red-900/50 dark:bg-red-950/20",
  info: "border-blue-200/80 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/20",
};

export function AdminAttentionPanel({ items }: { items: AdminAttentionItem[] }) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Needs attention</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
            Everything looks clear. No urgent admin tasks right now.
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 transition-opacity hover:opacity-90",
                  toneStyles[item.tone]
                )}
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
