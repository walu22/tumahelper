import { Check, X } from "lucide-react";
import {
  SERVICE_CATALOG,
  getServiceType,
  type ServiceCategoryKey,
} from "@/lib/services/catalog";

interface ServiceScopeCardProps {
  category: ServiceCategoryKey;
  serviceType: string;
  compact?: boolean;
}

export function ServiceScopeCard({ category, serviceType, compact = false }: ServiceScopeCardProps) {
  const entry = SERVICE_CATALOG[category];
  const type = getServiceType(category, serviceType);
  if (!type) return null;

  const includedHeading =
    category === "nanny" ? "What's included in this visit" : "What's included in this clean";
  const hasNotIncluded = Boolean(type.notIncluded?.length);

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="border-b border-border bg-surface/80 px-5 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          {entry.title}
        </p>
        <h3 className="font-semibold text-foreground text-lg">{type.label}</h3>
        {!compact && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{type.description}</p>
        )}
      </div>

      <div
        className={
          hasNotIncluded
            ? "grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border"
            : ""
        }
      >
        <div className="p-5 sm:p-6">
          <p className="text-sm font-semibold mb-3">{includedHeading}</p>
          <ul className="space-y-2">
            {type.included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {hasNotIncluded && type.notIncluded && (
          <div className="p-5 sm:p-6 bg-surface/40">
            <p className="text-sm font-semibold mb-3">Not included</p>
            <ul className="space-y-2">
              {type.notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-muted-foreground/70 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
