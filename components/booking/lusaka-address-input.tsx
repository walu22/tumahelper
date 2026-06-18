"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  LUSAKA_POPULAR_AREAS,
  searchLusakaPlaces,
  type LusakaPlaceSuggestion,
} from "@/lib/lusaka/places";
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
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = searchLusakaPlaces(value);

  useEffect(() => {
    setActiveIndex(0);
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

  function selectSuggestion(suggestion: LusakaPlaceSuggestion) {
    onChange(suggestion.fillValue);
    setOpen(false);
  }

  function appendArea(area: string) {
    const match = suggestions.find((s) => s.area === area);
    onChange(match?.fillValue ?? (value.trim() ? `${value.trim()}, ${area}` : area));
    setOpen(false);
  }

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
            if (!open || suggestions.length === 0) return;
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
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          className={cn("h-11 rounded-xl pr-10", className)}
        />
        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

        {open && suggestions.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden"
          >
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.area} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm hover:bg-surface transition-colors",
                    index === activeIndex && "bg-primary/5"
                  )}
                >
                  <span className="font-medium text-foreground">{suggestion.fillValue}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {suggestion.area}, Lusaka
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
