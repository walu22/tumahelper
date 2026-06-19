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
  /** Rich cards with label + description (homepage). Default is compact pills. */
  variant?: "pill" | "descriptive";
}

export function CleaningTypeTabs({
  value,
  onChange,
  getHref,
  showDetails = true,
  centered = false,
  edgeToEdge = false,
  showSelection = true,
  variant = "pill",
}: CleaningTypeTabsProps) {
  const types = getResidentialCleaningTypes();
  const selected: ServiceTypeOption | undefined =
    getServiceType("cleaning", value) ?? types[0];

  function renderTab(type: ServiceTypeOption) {
    const active = showSelection && value === type.id;
    const href = getHref?.(type.id);
    const label = type.tabLabel ?? type.label;

    if (variant === "descriptive") {
      const className = cn(
        "shrink-0 flex flex-col rounded-2xl border-2 px-4 py-3 text-left transition-colors w-[14.5rem] sm:w-[15.5rem] min-h-[7.5rem]",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5"
      );
      const content = (
        <>
          <span className="text-sm font-semibold leading-snug">{label}</span>
          <span
            className={cn(
              "mt-2 text-xs leading-relaxed line-clamp-3",
              active ? "text-primary-foreground/90" : "text-muted-foreground"
            )}
          >
            {type.description}
          </span>
          <span
            className={cn(
              "mt-auto pt-2 text-xs font-semibold tabular-nums",
              active ? "text-primary-foreground" : "text-foreground"
            )}
          >
            From K{type.priceHintMin}
          </span>
        </>
      );

      if (href) {
        return (
          <Link
            key={type.id}
            href={href}
            role="tab"
            aria-selected={active}
            aria-label={`${label}. ${type.description}`}
            className={className}
          >
            {content}
          </Link>
        );
      }

      return (
        <button
          key={type.id}
          type="button"
          role="tab"
          aria-selected={active}
          aria-label={`${label}. ${type.description}`}
          onClick={() => onChange?.(type.id)}
          className={className}
        >
          {content}
        </button>
      );
    }

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
            aria-label="Type of clean"
            className={cn(
              "mx-auto flex w-max min-w-full flex-nowrap justify-center gap-2 py-1",
              variant === "descriptive" && "gap-3 items-stretch"
            )}
          >
            {tabs}
          </div>
        </div>
      ) : (
        <div
          role="tablist"
          aria-label="Type of clean"
          className={cn(
            "flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide py-1 scroll-px-4",
            variant === "descriptive" && "gap-3 items-stretch"
          )}
        >
          {tabs}
        </div>
      )}

      {showDetails && selected && variant === "pill" && (
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
