import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import {
  SERVICE_CATALOG,
  type ServiceCategoryKey,
  defaultServiceDetails,
} from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";

const VALID: ServiceCategoryKey[] = [
  "cleaning",
  "nanny",
  "housekeeping",
  "cooking",
  "laundry",
  "garden",
];

export default function ServiceCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const key = params.category as ServiceCategoryKey;
  if (!VALID.includes(key)) notFound();

  const entry = SERVICE_CATALOG[key];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <Link href="/" className="text-sm text-primary hover:underline mb-8 inline-block">
          ← Back to home
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{entry.title}</h1>
        <p className="text-lg text-muted-foreground mb-10">{entry.tagline}</p>

        <div className="space-y-8 mb-12">
          {entry.types.map((type) => (
            <div key={type.id} className="rounded-2xl border border-border p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-xl font-semibold">{type.label}</h2>
                  <p className="text-muted-foreground mt-1">{type.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ~{type.defaultHours} hours · typical K{type.priceHintMin} – K{type.priceHintMax}
                  </p>
                </div>
                <Link
                  href={buildBookUrl({
                    ...defaultServiceDetails(key),
                    serviceType: type.id,
                    durationHours: type.defaultHours,
                  })}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 shrink-0"
                >
                  Book this
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="text-sm font-semibold mb-2">What&apos;s included</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {type.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {entry.addons.length > 0 && (
          <div className="rounded-2xl bg-surface border border-border p-6 md:p-8 mb-10">
            <h2 className="font-display text-xl font-semibold mb-4">Optional extras</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {entry.addons.map((addon) => (
                <div key={addon.id} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-medium">{addon.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">+ ~K{addon.priceHint}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          href={buildBookUrl(defaultServiceDetails(key))}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
        >
          Start booking
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}
