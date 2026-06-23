"use client";

import { Check, X } from "lucide-react";
import {
  getServiceDetailsType,
  resolvePrepareBeforeVisit,
  resolvePriceDrivers,
  resolveSelectionSummary,
  WHAT_HAPPENS_NEXT,
  type ServiceDetailsVariant,
} from "@/lib/booking/service-details-content";
import type { ServiceCategoryKey } from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

interface ServiceDetailsCardProps {
  category: ServiceCategoryKey;
  serviceType: string;
  variant: ServiceDetailsVariant;
  className?: string;
}

function BulletList({
  items,
  icon: Icon,
  iconClassName,
}: {
  items: string[];
  icon: typeof Check;
  iconClassName?: string;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
          <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", iconClassName)} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ServiceDetailsCard({
  category,
  serviceType,
  variant,
  className,
}: ServiceDetailsCardProps) {
  const type = getServiceDetailsType(category, serviceType);
  if (!type) return null;

  const wrapperClass = cn(
    "rounded-2xl border border-border bg-surface/40 p-5 sm:p-6",
    className
  );

  if (variant === "selection") {
    return (
      <section className={wrapperClass} aria-label="Service details">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Service details
        </p>
        <p className="font-semibold text-foreground text-base">{type.label}</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{type.description}</p>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {resolveSelectionSummary(category, type)}
        </p>
      </section>
    );
  }

  if (variant === "plan") {
    return (
      <section className={wrapperClass} aria-label="What may affect your price">
        <p className="font-semibold text-foreground text-base">What may affect your price</p>
        <div className="mt-3">
          <BulletList items={resolvePriceDrivers(category, type)} icon={Check} iconClassName="text-primary" />
        </div>
      </section>
    );
  }

  if (variant === "confirm") {
    return (
      <section className={wrapperClass} aria-label="What happens next">
        <p className="font-semibold text-foreground text-base">What happens next</p>
        <div className="mt-3">
          <BulletList items={[...WHAT_HAPPENS_NEXT]} icon={Check} iconClassName="text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className={wrapperClass} aria-label="Service details">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        Service details
      </p>
      <p className="font-semibold text-foreground text-base">{type.label}</p>

      <div className="mt-5 space-y-5">
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">What&apos;s included</p>
          <BulletList items={type.included} icon={Check} iconClassName="text-primary" />
        </div>

        {type.notIncluded && type.notIncluded.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Not included</p>
            <BulletList
              items={type.notIncluded}
              icon={X}
              iconClassName="text-muted-foreground/70"
            />
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Before the helper arrives</p>
          <BulletList
            items={resolvePrepareBeforeVisit(category, type)}
            icon={Check}
            iconClassName="text-primary"
          />
        </div>
      </div>
    </section>
  );
}
