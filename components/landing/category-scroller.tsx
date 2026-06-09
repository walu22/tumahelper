import Link from "next/link";
import { HERO_CATEGORIES } from "@/lib/landing/content";

export function CategoryScroller() {
  return (
    <div>
      <p className="text-sm font-semibold text-center text-muted-foreground mb-6">
        Choose the service you need
      </p>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
        {HERO_CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="snap-start shrink-0 flex flex-col items-center gap-2.5 min-w-[5rem] group"
          >
            <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-surface border-2 border-border group-hover:border-primary group-hover:bg-primary/5 transition-all">
              <cat.icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
            </div>
            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors text-center">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
