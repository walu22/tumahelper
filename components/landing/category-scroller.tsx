"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { HERO_CATEGORIES } from "@/lib/landing/content";
import { ServiceIcon } from "@/components/brand/service-icons";
import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import { getResidentialCleaningTypes } from "@/lib/services/catalog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CategoryScroller() {
  const router = useRouter();
  const cleaningTypes = getResidentialCleaningTypes();
  const [cleaningExpanded, setCleaningExpanded] = useState(false);
  const [cleaningType, setCleaningType] = useState(cleaningTypes[0]?.id ?? "standard");

  function handleCleaningClick() {
    setCleaningExpanded((open) => !open);
  }

  function bookCleaning() {
    router.push(`/customer/book?category=cleaning&type=${cleaningType}`);
  }

  return (
    <div>
      <p className="text-sm font-semibold text-center text-muted-foreground mb-6">
        Choose the service you need
      </p>
      <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
        {HERO_CATEGORIES.map((cat) => {
          const isCleaning = cat.icon === "indoor";

          if (isCleaning) {
            return (
              <button
                key={cat.label}
                type="button"
                onClick={handleCleaningClick}
                aria-expanded={cleaningExpanded}
                aria-controls="hero-cleaning-panel"
                className={cn(
                  "snap-start shrink-0 flex flex-col items-center gap-2 min-w-[5.5rem] group rounded-2xl p-1 -m-1 transition-colors",
                  cleaningExpanded && "bg-primary/10"
                )}
              >
                <div
                  className={cn(
                    "transition-transform",
                    cleaningExpanded ? "scale-105" : "group-hover:scale-105"
                  )}
                >
                  <ServiceIcon name={cat.icon} className="h-16 w-16" />
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold transition-colors text-center max-w-[5.5rem]",
                    cleaningExpanded ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}
                >
                  {cat.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={() => setCleaningExpanded(false)}
              className="snap-start shrink-0 flex flex-col items-center gap-2 min-w-[5.5rem] group"
            >
              <div className="transition-transform group-hover:scale-105">
                <ServiceIcon name={cat.icon} className="h-16 w-16" />
              </div>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors text-center max-w-[5.5rem]">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>

      {cleaningExpanded && (
        <div
          id="hero-cleaning-panel"
          className="mt-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <CleaningTypeTabs
            value={cleaningType}
            onChange={setCleaningType}
            showDetails={false}
            centered
          />
          <Button
            type="button"
            className="w-full sm:w-auto sm:min-w-[12rem] mt-5 min-h-11 rounded-full mx-auto flex"
            onClick={bookCleaning}
          >
            Book this clean
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
