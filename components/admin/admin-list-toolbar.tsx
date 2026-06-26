"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AdminListFilter = {
  param: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  allLabel?: string;
};

export type AdminListToolbarProps = {
  searchPlaceholder?: string;
  searchParam?: string;
  filters?: AdminListFilter[];
  className?: string;
};

export function AdminListToolbar({
  searchPlaceholder = "Search...",
  searchParam = "q",
  filters = [],
  className,
}: AdminListToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get(searchParam) ?? "");

  function pushParams(updates: Record<string, string | null>, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }

    if (resetPage) params.delete("page");

    const next = params.toString();
    startTransition(() => {
      router.push(next ? `${pathname}?${next}` : pathname);
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pushParams({ [searchParam]: query.trim() || null });
  }

  function clearSearch() {
    setQuery("");
    pushParams({ [searchParam]: null });
  }

  const hasActiveFilters =
    Boolean(searchParams.get(searchParam)) ||
    filters.some((filter) => Boolean(searchParams.get(filter.param)));

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form onSubmit={handleSearchSubmit} className="flex min-w-0 flex-1 gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="rounded-xl pl-9"
              aria-label={searchPlaceholder}
            />
          </div>
          <Button type="submit" variant="outline" className="rounded-xl" disabled={isPending}>
            Search
          </Button>
          {query ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </form>

        {filters.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const currentValue = searchParams.get(filter.param) ?? "";
              return (
                <label key={filter.param} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{filter.label}</span>
                  <select
                    value={currentValue}
                    onChange={(event) =>
                      pushParams({ [filter.param]: event.target.value || null })
                    }
                    className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
                    aria-label={filter.label}
                  >
                    <option value="">{filter.allLabel ?? "All"}</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>
        ) : null}
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Active filters</span>
          {searchParams.get(searchParam) ? (
            <FilterChip
              label={`Search: ${searchParams.get(searchParam)}`}
              onClear={() => {
                setQuery("");
                pushParams({ [searchParam]: null });
              }}
            />
          ) : null}
          {filters.map((filter) => {
            const value = searchParams.get(filter.param);
            if (!value) return null;
            const label = filter.options.find((option) => option.value === value)?.label ?? value;
            return (
              <FilterChip
                key={filter.param}
                label={`${filter.label}: ${label}`}
                onClear={() => pushParams({ [filter.param]: null })}
              />
            );
          })}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 rounded-full px-2 text-xs"
            onClick={() => {
              setQuery("");
              startTransition(() => router.push(pathname));
            }}
          >
            Clear all
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-foreground"
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}
