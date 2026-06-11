import { notFound } from "next/navigation";
import { DevBookingUiHarness } from "./dev-booking-ui-harness";

export default function DevBookingUiTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Booking UI test harness</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Development only — used by Playwright for worker actions and payment upload.
        </p>
      </div>
      <DevBookingUiHarness />
    </div>
  );
}
