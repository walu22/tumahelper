"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HERO_POPULAR_SEARCHES,
  searchHeroServices,
  type HeroSearchResult,
} from "@/lib/landing/hero-search";
import { cn } from "@/lib/utils";

export function HeroServiceSearch() {
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchHeroServices(query), [query]);
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

  function goToResult(result: HeroSearchResult) {
    setOpen(false);
    if (result.href.startsWith("/#")) {
      window.location.href = result.href;
      return;
    }
    router.push(result.href);
  }

  function submitSearch() {
    const match = results[activeIndex] ?? results[0];
    if (match) goToResult(match);
  }

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto mb-10">
      <div
        className={cn(
          "flex items-stretch rounded-2xl border-2 bg-card shadow-lg transition-shadow",
          open ? "border-primary shadow-primary/10" : "border-border"
        )}
      >
        <div className="flex flex-1 items-center min-w-0 pl-4 sm:pl-5">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && results.length > 0) {
                e.preventDefault();
                setActiveIndex((index) => Math.min(index + 1, results.length - 1));
              } else if (e.key === "ArrowUp" && results.length > 0) {
                e.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                submitSearch();
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="What do you need help with?"
            aria-label="Search for a home service"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            className="h-14 sm:h-16 w-full bg-transparent px-3 sm:px-4 text-base sm:text-lg outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Button
          type="button"
          onClick={submitSearch}
          disabled={results.length === 0}
          aria-label="Search"
          className="h-14 sm:h-16 rounded-none rounded-r-[0.9rem] px-4 sm:px-5 shrink-0"
        >
          <Search className="h-5 w-5" aria-hidden />
        </Button>
      </div>

      {showDropdown && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 w-full max-w-2xl rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
        >
          <li className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border">
            {query.trim() ? "Matching services" : "Popular services"}
          </li>
          {results.map((result, index) => (
            <li key={result.id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToResult(result)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-surface transition-colors",
                  index === activeIndex && "bg-primary/5"
                )}
              >
                <span className="font-medium text-foreground">{result.label}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {result.categoryLabel}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 px-1">
        <span className="text-xs text-muted-foreground mr-1">Popular:</span>
        {HERO_POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => {
              setQuery(term);
              setOpen(true);
              inputRef.current?.focus();
            }}
            className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
