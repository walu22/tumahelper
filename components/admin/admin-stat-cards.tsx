import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminStat } from "@/lib/admin/dashboard-data";

export function AdminStatCards({ stats }: { stats: AdminStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {stats.map((stat) => (
        <AdminStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

function AdminStatCard({ stat }: { stat: AdminStat }) {
  return (
    <Link href={stat.href} className="group block">
      <Card className="h-full rounded-2xl border-border/70 shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </CardHeader>
        <CardContent>
          <p className="font-display text-2xl font-bold tracking-tight">{stat.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function AdminQuickLinks({
  links,
}: {
  links: Array<{ href: string; label: string; description: string; icon: LucideIcon }>;
}) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-start gap-3 rounded-xl border border-border/60 px-3 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
