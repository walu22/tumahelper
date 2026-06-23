"use client";

import Link from "next/link";
import {
  getNannyTypes,
  getServiceType,
  type ServiceTypeOption,
} from "@/lib/services/catalog";
import { cn } from "@/lib/utils";
import { ServiceDetailsCard } from "@/components/booking/service-details-card";

interface NannyTypeTabsProps {
  value: string;
  onChange?: (typeId: string) => void;
  getHref?: (typeId: string) => string;
  showDetails?: boolean;
  centered?: boolean;
  edgeToEdge?: boolean;
  showSelection?: boolean;
}

export function NannyTypeTabs({
  value,
  onChange,
  getHref,
  showDetails = true,
  centered = false,
  edgeToEdge = false,
  showSelection = true,
}: NannyTypeTabsProps) {
  const types = getNannyTypes();
  const selected: ServiceTypeOption | undefined =
    getServiceType("nanny", value) ?? types[0];

  function renderTab(type: ServiceTypeOption) {
    const active = showSelection && value === type.id;
    const href = getHref?.(type.id);
    const label = type.tabLabel ?? type.label;

    const pillClass = cn(
      "shrink-0 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-colors min-h-11 whitespace-nowrap inline-flex items-center",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-foreground hover:border-primary/40"
    );

    if (href) {
      return (
        <Link
          key={type.id}
          href={href}
          role="tab"
          aria-selected={active}
          title={type.description}
          aria-label={`${label}. ${type.description}`}
          className={pillClass}
        >
          {label}
        </Link>
      );
    }

    return (
      <button
        key={type.id}
        type="button"
        role="tab"
        aria-selected={active}
        title={type.description}
        aria-label={`${label}. ${type.description}`}
        onClick={() => onChange?.(type.id)}
        className={pillClass}
      >
        {label}
      </button>
    );
  }

  const tabs = types.map(renderTab);
  const centerScroll = centered || edgeToEdge;

  return (
    <div className="space-y-4">
      {centerScroll ? (
        <div
          className={cn(
            "w-full overflow-x-auto scrollbar-hide scroll-px-4",
            edgeToEdge && "-mx-4 px-4 sm:-mx-6 sm:px-6"
          )}
        >
          <div
            role="tablist"
            aria-label="Type of care"
            className="mx-auto flex w-max min-w-full flex-nowrap justify-center gap-2 py-1"
          >
            {tabs}
          </div>
        </div>
      ) : (
        <div
          role="tablist"
          aria-label="Type of care"
          className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide py-1 scroll-px-4"
        >
          {tabs}
        </div>
      )}

      {showDetails && selected && (
        <ServiceDetailsCard category="nanny" serviceType={selected.id} variant="selection" />
      )}
    </div>
  );
}
