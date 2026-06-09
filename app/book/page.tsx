import { redirect } from "next/navigation";

const FORWARD_PARAMS = [
  "worker",
  "category",
  "type",
  "hours",
  "bedrooms",
  "bathrooms",
  "children",
  "ages",
  "addons",
] as const;

/** Legacy /book URL — always use /customer/book */
export default function BookRedirect({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams();
  for (const key of FORWARD_PARAMS) {
    const val = searchParams[key];
    if (val) params.set(key, val);
  }
  const qs = params.toString();
  redirect(qs ? `/customer/book?${qs}` : "/customer/book");
}
