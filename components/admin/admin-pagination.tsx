import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildAdminListHref } from "@/lib/admin/list-query";

export function AdminPagination({
  page,
  totalPages,
  total,
  pathname,
  searchParams,
}: {
  page: number;
  totalPages: number;
  total: number;
  pathname: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const prevHref =
    page > 1
      ? buildAdminListHref(pathname, searchParams, { page: String(page - 1) })
      : null;
  const nextHref =
    page < totalPages
      ? buildAdminListHref(pathname, searchParams, { page: String(page + 1) })
      : null;

  const rangeStart = (page - 1) * 20 + 1;
  const rangeEnd = Math.min(page * 20, total);

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {rangeStart}-{rangeEnd} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-full" disabled={!prevHref} asChild={!!prevHref}>
          {prevHref ? (
            <Link href={prevHref}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Link>
          ) : (
            <span>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </span>
          )}
        </Button>
        <span className="px-2 text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="sm" className="rounded-full" disabled={!nextHref} asChild={!!nextHref}>
          {nextHref ? (
            <Link href={nextHref}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <span>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
