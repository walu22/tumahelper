import { describe, expect, it } from "vitest";
import { summarizeWorkerEarnings } from "./earnings";

describe("worker earnings summary", () => {
  it("totals paid bookings and groups by month", () => {
    const summary = summarizeWorkerEarnings([
      {
        amount: 40000,
        worker_earnings: 36000,
        platform_fee: 4000,
        service_date: "2026-06-10",
        payment_status: "confirmed",
        status: "completed",
      },
      {
        amount: 30000,
        worker_earnings: 27000,
        platform_fee: 3000,
        service_date: "2026-05-15",
        payment_status: "paid",
        status: "completed",
      },
      {
        amount: 20000,
        worker_earnings: 18000,
        platform_fee: 2000,
        service_date: "2026-06-02",
        payment_status: "pending",
        status: "completed",
      },
    ]);

    expect(summary.totalEarnings).toBe(63000);
    expect(summary.monthlyHistory).toHaveLength(2);
    expect(summary.monthlyHistory[0]?.bookings).toBe(1);
  });
});
