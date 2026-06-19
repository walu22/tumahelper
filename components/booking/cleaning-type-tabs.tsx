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
}

export function CleaningTypeTabs({
  value,
  onChange,
  getHref,
  showDetails = true,
  centered = false,
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

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="Type of clean"
        className={cn(
          "flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1",
          centered && "justify-center"
        )}
      >
        {types.map((type) => {
          const active = value === type.id;
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
        })}
      </div>

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
