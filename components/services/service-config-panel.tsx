"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CHILD_AGE_GROUPS,
  DURATION_OPTIONS,
  SERVICE_CATALOG,
  type ServiceCategoryKey,
  type ServiceDetails,
  getServiceType,
} from "@/lib/services/catalog";
import { suggestDuration, suggestPrice } from "@/lib/services/utils";

const HOME_SIZE_PRESETS = [
  { id: "small", label: "Small", sub: "1–2 bedrooms", bedrooms: 2, bathrooms: 1 },
  { id: "medium", label: "Medium", sub: "3–4 bedrooms", bedrooms: 3, bathrooms: 2 },
  { id: "large", label: "Large", sub: "5+ bedrooms", bedrooms: 5, bathrooms: 3 },
] as const;

interface ServiceConfigPanelProps {
  category: ServiceCategoryKey;
  value: ServiceDetails;
  onChange: (details: ServiceDetails) => void;
  showPriceHint?: boolean;
}

export function ServiceConfigPanel({
  category,
  value,
  onChange,
  showPriceHint = true,
}: ServiceConfigPanelProps) {
  const entry = SERVICE_CATALOG[category];
  const selectedType = getServiceType(category, value.serviceType);
  const price = suggestPrice(value);
  const recommendedHours = suggestDuration(value);
  const showHourSuggestion = recommendedHours !== value.durationHours;

  function applyHomePreset(bedrooms: number, bathrooms: number) {
    const next = { ...value, bedrooms, bathrooms };
    onChange({ ...next, durationHours: suggestDuration(next) });
  }

  function update(patch: Partial<ServiceDetails>) {
    onChange({ ...value, ...patch });
  }

  function toggleAddon(id: string) {
    const addons = value.addons.includes(id)
      ? value.addons.filter((a) => a !== id)
      : [...value.addons, id];
    update({ addons });
  }

  function toggleAgeGroup(id: string) {
    const current = value.childAgeGroups ?? [];
    const next = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    update({ childAgeGroups: next.length ? next : current });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-3">Service type</p>
        <div className="grid gap-3">
          {entry.types.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() =>
                update({ serviceType: type.id, durationHours: type.defaultHours })
              }
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-colors",
                value.serviceType === type.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <p className="font-semibold">{type.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedType && (
        <div className="rounded-xl bg-surface border border-border p-4">
          <p className="text-sm font-semibold mb-2">What&apos;s included</p>
          <ul className="space-y-1.5">
            {selectedType.included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {category === "cleaning" ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Home size</p>
            <div className="grid grid-cols-3 gap-2">
              {HOME_SIZE_PRESETS.map((preset) => {
                const active =
                  (value.bedrooms ?? 3) === preset.bedrooms &&
                  (value.bathrooms ?? 2) === preset.bathrooms;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyHomePreset(preset.bedrooms, preset.bathrooms)}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <p className="text-sm font-semibold">{preset.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{preset.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Bedrooms</label>
            <select
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
              value={value.bedrooms ?? 3}
              onChange={(e) => update({ bedrooms: parseInt(e.target.value, 10) })}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n === 6 ? "5+" : n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Bathrooms</label>
            <select
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
              value={value.bathrooms ?? 2}
              onChange={(e) => update({ bathrooms: parseInt(e.target.value, 10) })}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Number of children</label>
            <select
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
              value={value.children ?? 1}
              onChange={(e) => update({ children: parseInt(e.target.value, 10) })}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Age groups</p>
            <div className="flex flex-wrap gap-2">
              {CHILD_AGE_GROUPS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleAgeGroup(id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                    value.childAgeGroups?.includes(id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-sm font-medium">Duration</p>
          {showHourSuggestion && (
            <button
              type="button"
              onClick={() => update({ durationHours: recommendedHours })}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Use recommended {recommendedHours}h
            </button>
          )}
        </div>
        {showHourSuggestion && (
          <p className="text-xs text-muted-foreground mb-2">
            Based on your home size and extras, we recommend {recommendedHours} hours.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => update({ durationHours: h })}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium border transition-colors",
                value.durationHours === h
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/40"
              )}
            >
              {h} hours
            </button>
          ))}
        </div>
      </div>

      {entry.addons.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Add extras (optional)</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {entry.addons.map((addon) => (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddon(addon.id)}
                className={cn(
                  "rounded-xl border p-3 text-left text-sm transition-colors",
                  value.addons.includes(addon.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <p className="font-medium">{addon.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{addon.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {showPriceHint && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
          <p className="font-semibold text-primary mb-1">Typical price range</p>
          <p className="text-muted-foreground">
            K{price.min} – K{price.max} for this scope (you agree the final amount with your
            worker). Suggested:{" "}
            <span className="font-semibold text-foreground">K{price.typical}</span>
          </p>
        </div>
      )}
    </div>
  );
}
