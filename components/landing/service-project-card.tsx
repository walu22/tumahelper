import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceTypeOption } from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

interface ServiceProjectCardProps {
  type: ServiceTypeOption;
  href: string;
  className?: string;
}

/** TaskRabbit-style “Popular project” card with price hint and direct book link. */
export function ServiceProjectCard({ type, href, className }: ServiceProjectCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-5",
        "hover:border-primary/40 hover:bg-primary/5 transition-colors min-h-[8.5rem]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 flex-1">
        <div className="min-w-0">
          <p className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {type.label}
          </p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {type.description}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
      </div>
      <p className="text-sm font-semibold text-foreground mt-4 tabular-nums">
        From K{type.priceHintMin}
      </p>
    </Link>
  );
}
