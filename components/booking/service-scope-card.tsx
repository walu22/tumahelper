import { CheckCircle2, XCircle, PlusCircle, Clock } from "lucide-react";
import {
  getAvailableAddons,
  type ServiceCategoryKey,
  type ServiceTypeOption,
} from "@/lib/services/catalog";
import { getAddonSectionCopy } from "@/lib/services/utils";

export function ServiceScopeCard({
  category,
  type,
}: {
  category: ServiceCategoryKey;
  type: ServiceTypeOption;
}) {
  if (!type) return null;

  const addons = getAvailableAddons(category, type.id);
  const section = getAddonSectionCopy(category);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 mt-4 space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{type.description}</p>
        {type.defaultHours && (
          <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary">
            <Clock className="w-4 h-4" />
            Suggested duration: {type.defaultHours} hours
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {type.included && type.included.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Included
            </h4>
            <ul className="space-y-2">
              {type.included.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {type.notIncluded && type.notIncluded.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-destructive" />
              Not included
            </h4>
            <ul className="space-y-2">
              {type.notIncluded.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-destructive/60 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {addons.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
            <PlusCircle className="w-4 h-4 text-muted-foreground" />
            {section.previewTitle}
          </h4>
          <p className="text-xs text-muted-foreground mb-3">{section.pickerSubtitle}</p>
          <div className="flex flex-wrap gap-2">
            {addons.map((addon) => (
              <span
                key={addon.id}
                className="text-xs px-2.5 py-1 bg-surface rounded-md border border-border text-muted-foreground"
              >
                {addon.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
