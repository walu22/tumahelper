import { type ServiceDetails, getServiceType } from "@/lib/services/catalog";
import { getServiceScopeRows } from "@/lib/services/utils";
import { ServiceScopeDetails } from "@/components/booking/service-scope-details";

export function ServiceSummary({ details }: { details: ServiceDetails }) {
  const type = getServiceType(details.category, details.serviceType);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
      <div>
        <p className="text-sm font-semibold">{type?.label ?? "Service"}</p>
        {type?.description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{type.description}</p>
        )}
        <div className="mt-2">
          <ServiceScopeDetails rows={getServiceScopeRows(details)} />
        </div>
      </div>
    </div>
  );
}
