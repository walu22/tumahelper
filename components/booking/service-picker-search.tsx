"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  HERO_POPULAR_SEARCHES,
  resolvePopularHeroSearch,
  searchBookServices,
  type HeroSearchResult,
} from "@/lib/landing/hero-search";
import { cn } from "@/lib/utils";

type ServicePickerSearchProps = {
  onResult: (result: HeroSearchResult) => void;
  placeholder?: string;
  className?: string;
};

export function ServicePickerSearch({
  onResult,
  placeholder = "Search for nanny, cleaning, plumbing…",
  className,
}: ServicePickerSearchProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchBookServices(query), [query]);
  const showDropdown = open && results.length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function chooseResult(result: HeroSearchResult) {
    setOpen(false);
    onResult(result);
  }

  function submitSearch() {
    const match = results[activeIndex] ?? results[0];
    if (match) chooseResult(match);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border bg-card shadow-sm transition-shadow",
          "h-12 sm:h-14 pl-4 pr-2",
          open ? "border-primary shadow-md shadow-primary/5" : "border-border/70"
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && results.length > 0) {
              event.preventDefault();
              setActiveIndex((index) => Math.min(index + 1, results.length - 1));
            } else if (event.key === "ArrowUp" && results.length > 0) {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            } else if (event.key === "Enter") {
              event.preventDefault();
              submitSearch();
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          aria-label="Search for a home service"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm sm:text-base placeholder:text-muted-foreground outline-none"
        />
        <button
          type="button"
          onClick={submitSearch}
          disabled={results.length === 0}
          aria-label="Search services"
          className="shrink-0 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {showDropdown ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 w-full rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
        >
          <li className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {query.trim() ? "Matching services" : "Popular services"}
          </li>
          {results.map((result, index) => (
            <li key={result.id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => chooseResult(result)}
                className={cn(
                  "w-full px-4 py-3 text-left transition-colors hover:bg-muted/50",
                  index === activeIndex && "bg-primary/5"
                )}
              >
                <span className="font-medium text-foreground">{result.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {result.categoryLabel}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Try:</span>
        {HERO_POPULAR_SEARCHES.slice(0, 5).map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => {
              const result = resolvePopularHeroSearch(term);
              if (result?.href.startsWith("/customer/book")) {
                chooseResult(result);
                return;
              }
              setQuery(term);
              setOpen(true);
            }}
            className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
