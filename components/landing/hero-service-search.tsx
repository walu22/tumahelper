"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
          "flex items-center gap-2 rounded-full border-2 bg-card shadow-lg transition-shadow",
          "h-14 sm:h-[4.25rem] pl-5 sm:pl-6 pr-1.5 sm:pr-2",
          "focus-within:outline-none focus-within:ring-0",
          open ? "border-primary shadow-primary/10" : "border-border"
        )}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          enterKeyHint="search"
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
          className={cn(
            "min-w-0 flex-1 h-full bg-transparent border-0 shadow-none",
            "text-base sm:text-lg placeholder:text-muted-foreground",
            "appearance-none [-webkit-appearance:none]",
            "outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
            "focus:shadow-none [-webkit-tap-highlight-color:transparent]"
          )}
        />
        <button
          type="button"
          onClick={submitSearch}
          disabled={results.length === 0}
          aria-label="Search"
          className={cn(
            "shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground",
            "h-10 w-10 sm:h-11 sm:w-11 transition-opacity",
            "hover:bg-primary/90 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0",
            "[-webkit-tap-highlight-color:transparent]",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          <Search className="h-5 w-5" aria-hidden />
        </button>
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
                  "outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0",
                  "[-webkit-tap-highlight-color:transparent]",
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
            }}
            className={cn(
              "rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-foreground",
              "hover:border-primary/40 hover:bg-primary/5 transition-colors",
              "outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0",
              "[-webkit-tap-highlight-color:transparent]"
            )}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
