import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WorkerBookingDetail } from "@/components/booking/worker-booking-detail";

export default async function WorkerBookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "worker") redirect("/dashboard");

  return <WorkerBookingDetail bookingId={params.id} />;
}
