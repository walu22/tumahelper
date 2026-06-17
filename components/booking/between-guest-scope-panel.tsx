import { Check, X } from "lucide-react";
import { getServiceType } from "@/lib/services/catalog";

export function BetweenGuestScopePanel() {
  const serviceType = getServiceType("cleaning", "airbnb");
  if (!serviceType) return null;

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="border-b border-border bg-surface/80 px-5 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Between-guest clean
        </p>
        <h3 className="font-semibold text-foreground text-lg">{serviceType.label}</h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {serviceType.description}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        <div className="p-5 sm:p-6">
          <p className="text-sm font-semibold mb-3">Included in this clean</p>
          <ul className="space-y-2">
            {serviceType.included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {serviceType.notIncluded && serviceType.notIncluded.length > 0 && (
          <div className="p-5 sm:p-6 bg-surface/40">
            <p className="text-sm font-semibold mb-3">Not included</p>
            <ul className="space-y-2">
              {serviceType.notIncluded.map((item) => (
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
