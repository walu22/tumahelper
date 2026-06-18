"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LUSAKA_POPULAR_AREAS } from "@/lib/lusaka/places";
import type { AddressSuggestion } from "@/lib/lusaka/address-search";
import { cn } from "@/lib/utils";

interface LusakaAddressInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function LusakaAddressInput({
  id,
  value,
  onChange,
  placeholder = "e.g. Plot 12, Kabulonga",
  required,
  className,
}: LusakaAddressInputProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions]);

  useEffect(() => {
    const q = value.trim();

    if (!q) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      try {
        const response = await fetch(`/api/addresses/suggest?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as { suggestions: AddressSuggestion[] };
        setSuggestions(data.suggestions ?? []);
        setOpen(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectSuggestion(suggestion: AddressSuggestion) {
    onChange(suggestion.fillValue);
    setOpen(false);
  }

  function appendArea(area: string) {
    const trimmed = value.trim();
    const fillValue = trimmed
      ? trimmed.toLowerCase().includes(area.toLowerCase())
        ? trimmed
        : `${trimmed}, ${area}`
      : area;
    onChange(fillValue);
    setOpen(false);
  }

  const showDropdown = open && (suggestions.length > 0 || loading);

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!showDropdown || suggestions.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && suggestions[activeIndex]) {
              e.preventDefault();
              selectSuggestion(suggestions[activeIndex]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          required={required}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          className={cn("h-11 rounded-xl pr-10", className)}
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        )}

        {showDropdown && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-xl border border-border bg-card shadow-lg"
          >
            {loading && suggestions.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted-foreground">Looking up places in Lusaka...</li>
            )}
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.id} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm hover:bg-surface transition-colors",
                    index === activeIndex && "bg-primary/5"
                  )}
                >
                  <span className="font-medium text-foreground">{suggestion.label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {suggestion.sublabel ?? "Lusaka, Zambia"}
                    {suggestion.source === "street" ? " · Street" : " · Area"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Popular in Lusaka</p>
        <div className="flex flex-wrap gap-2">
          {LUSAKA_POPULAR_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => appendArea(area)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              {area}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
