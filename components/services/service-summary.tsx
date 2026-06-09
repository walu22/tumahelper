import { Check } from "lucide-react";
import {
  type ServiceDetails,
  getAddon,
  getServiceType,
} from "@/lib/services/catalog";
import { formatServiceSummary } from "@/lib/services/utils";

export function ServiceSummary({ details }: { details: ServiceDetails }) {
  const type = getServiceType(details.category, details.serviceType);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold">{type?.label ?? "Service"}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{formatServiceSummary(details)}</p>
      </div>

      {type && (
        <ul className="space-y-1">
          {type.included.slice(0, 4).map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
          {type.included.length > 4 && (
            <li className="text-xs text-muted-foreground pl-5">
              + {type.included.length - 4} more tasks included
            </li>
          )}
        </ul>
      )}

      {details.addons.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Extras:{" "}
          {details.addons.map((id) => getAddon(details.category, id)?.label ?? id).join(", ")}
        </p>
      )}
    </div>
  );
}
