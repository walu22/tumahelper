import { redirect, notFound } from "next/navigation";
import { pricingTabHref } from "@/lib/landing/content";
import type { ServiceCategoryKey } from "@/lib/services/catalog";

const VALID: ServiceCategoryKey[] = [
  "cleaning",
  "nanny",
  "housekeeping",
  "cooking",
  "laundry",
  "garden",
  "handyman",
];

/** Legacy route — service guides live in the homepage pricing section. */
export default function ServiceCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const key = params.category as ServiceCategoryKey;
  if (!VALID.includes(key)) notFound();

  redirect(pricingTabHref(key));
}
