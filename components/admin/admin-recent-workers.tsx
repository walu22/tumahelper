import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminRecentWorker } from "@/lib/admin/dashboard-data";

export function AdminRecentWorkersTable({
  workers,
}: {
  workers: AdminRecentWorker[];
}) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Recent worker signups</CardTitle>
        <Button variant="ghost" size="sm" className="rounded-full" asChild>
          <Link href="/admin/workers">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {workers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            <Users className="mb-2 h-8 w-8 opacity-50" />
            No workers yet
          </div>
        ) : (
          <div className="space-y-2">
            {workers.map((worker) => (
              <Link
                key={worker.id}
                href={`/admin/workers/${worker.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{worker.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {worker.area}, {worker.city}
                  </p>
                </div>
                <Badge
                  variant={worker.verification_status === "approved" ? "success" : "warning"}
                >
                  {worker.verification_status.replaceAll("_", " ")}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
