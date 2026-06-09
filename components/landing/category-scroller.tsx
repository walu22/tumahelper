import Link from "next/link";
import { HERO_CATEGORIES } from "@/lib/landing/content";

export function CategoryScroller() {
  return (
    <div className="relative">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4 text-center sm:text-left">
        Book trusted help for home tasks
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {HERO_CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="snap-start shrink-0 flex flex-col items-center gap-2 min-w-[5.5rem] group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-border shadow-sm group-hover:border-primary/40 group-hover:shadow-md transition-all">
              <cat.icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
