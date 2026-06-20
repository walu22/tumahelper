import Link from "next/link";
import { ServiceIcon } from "@/components/brand/service-icons";
import { SERVICES_DETAIL_INTRO } from "@/lib/landing/content";
import { getPricingSnapshotRows } from "@/lib/landing/pricing-snapshot";

export function PricingSnapshot() {
  const rows = getPricingSnapshotRows();

  return (
    <div>
      <div className="hidden md:block rounded-3xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface/60 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-4 font-semibold">Service</th>
              <th className="px-6 py-4 font-semibold">Popular visit</th>
              <th className="px-6 py-4 font-semibold">Hours</th>
              <th className="px-6 py-4 font-semibold">Typical price</th>
              <th className="px-6 py-4 font-semibold text-right"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-b-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ServiceIcon name={row.icon} className="h-9 w-9 shrink-0" />
                    <span className="font-semibold text-foreground">{row.serviceLabel}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{row.visitLabel}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{row.hoursLabel}</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{row.priceLabel}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    {row.guideHref && (
                      <Link
                        href={row.guideHref}
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        Details
                      </Link>
                    )}
                    <Link
                      href={row.bookHref}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
                    >
                      Book
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="md:hidden space-y-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <ServiceIcon name={row.icon} className="h-10 w-10 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-foreground">{row.serviceLabel}</p>
                <p className="text-sm font-medium text-foreground shrink-0">{row.priceLabel}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {row.visitLabel} · {row.hoursLabel}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Link
                  href={row.bookHref}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
                >
                  Book
                </Link>
                {row.guideHref && (
                  <Link
                    href={row.guideHref}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    What&apos;s included
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto leading-relaxed">
        {SERVICES_DETAIL_INTRO.footnote} Open <span className="font-medium text-foreground">Details</span>{" "}
        on any service for full inclusions and visit types.
      </p>
    </div>
  );
}
