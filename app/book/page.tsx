import { redirect } from "next/navigation";

/** Legacy /book URL — always use /customer/book */
export default function BookRedirect({
  searchParams,
}: {
  searchParams: { worker?: string; category?: string; service?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.worker) params.set("worker", searchParams.worker);
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.service) params.set("service", searchParams.service);
  const qs = params.toString();
  redirect(qs ? `/customer/book?${qs}` : "/customer/book");
}
