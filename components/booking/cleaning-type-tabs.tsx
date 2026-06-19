"use client";

import Link from "next/link";
import {
  getResidentialCleaningTypes,
  getServiceType,
  type ServiceTypeOption,
} from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

interface CleaningTypeTabsProps {
  value: string;
  onChange?: (typeId: string) => void;
  getHref?: (typeId: string) => string;
  showDetails?: boolean;
  centered?: boolean;
  /** Bleed pills to screen edges on mobile for easier horizontal scroll. */
  edgeToEdge?: boolean;
  /** When false, no pill appears selected (useful for homepage link rows). */
  showSelection?: boolean;
}

export function CleaningTypeTabs({
  value,
  onChange,
  getHref,
  showDetails = true,
  centered = false,
  edgeToEdge = false,
  showSelection = true,
}: CleaningTypeTabsProps) {
  const types = getResidentialCleaningTypes();
  const selected: ServiceTypeOption | undefined =
    getServiceType("cleaning", value) ?? types[0];

  const tabClassName = (active: boolean) =>
    cn(
      "shrink-0 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-colors min-h-11 whitespace-nowrap inline-flex items-center",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-foreground hover:border-primary/40"
    );

  const tabs = types.map((type) => {
    const active = showSelection && value === type.id;
    const href = getHref?.(type.id);

    if (href) {
      return (
        <Link
          key={type.id}
          href={href}
          role="tab"
          aria-selected={active}
          className={tabClassName(active)}
        >
          {type.tabLabel ?? type.label}
        </Link>
      );
    }

    return (
      <button
        key={type.id}
        type="button"
        role="tab"
        aria-selected={active}
        onClick={() => onChange?.(type.id)}
        className={tabClassName(active)}
      >
        {type.tabLabel ?? type.label}
      </button>
    );
  });

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
            aria-label="Type of clean"
            className="mx-auto flex w-max min-w-full flex-nowrap justify-center gap-2 py-1"
          >
            {tabs}
          </div>
        </div>
      ) : (
        <div
          role="tablist"
          aria-label="Type of clean"
          className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide py-1 scroll-px-4"
        >
          {tabs}
        </div>
      )}

      {showDetails && selected && (
        <div className="rounded-xl border border-border bg-surface/40 p-4 text-sm">
          <p className="font-semibold text-foreground">{selected.label}</p>
          <p className="text-muted-foreground mt-1 leading-relaxed">{selected.description}</p>
          <p className="text-xs text-muted-foreground mt-2 tabular-nums">
            Typical K{selected.priceHintMin} – K{selected.priceHintMax} · ~{selected.defaultHours}h
          </p>
        </div>
      )}
    </div>
  );
}
