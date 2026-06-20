export interface EarningsBookingRow {
  worker_earnings: number | null;
  amount: number;
  platform_fee?: number | null;
  service_date: string;
  payment_status: string | null;
  status: string;
}

export interface MonthlyEarningsSummary {
  month: string;
  label: string;
  amount: number;
  bookings: number;
  fee: number;
}

export interface WorkerEarningsSummary {
  totalEarnings: number;
  earningsThisMonth: number;
  totalFees: number;
  monthlyHistory: MonthlyEarningsSummary[];
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-ZM", {
    month: "long",
    year: "numeric",
  });
}

export function summarizeWorkerEarnings(bookings: EarningsBookingRow[]): WorkerEarningsSummary {
  const paid = bookings.filter((booking) =>
    ["paid", "confirmed"].includes(booking.payment_status ?? "")
  );

  const totalEarnings = paid.reduce(
    (sum, booking) => sum + (booking.worker_earnings ?? booking.amount),
    0
  );
  const totalFees = paid.reduce(
    (sum, booking) => sum + (booking.platform_fee ?? Math.round(booking.amount * 0.1)),
    0
  );

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const earningsThisMonth = paid
    .filter((booking) => booking.service_date >= monthStart)
    .reduce((sum, booking) => sum + (booking.worker_earnings ?? booking.amount), 0);

  const monthlyMap = new Map<string, MonthlyEarningsSummary>();

  for (const booking of paid) {
    const key = monthKey(booking.service_date);
    const current = monthlyMap.get(key) ?? {
      month: key,
      label: monthLabel(key),
      amount: 0,
      bookings: 0,
      fee: 0,
    };

    current.amount += booking.worker_earnings ?? booking.amount;
    current.fee += booking.platform_fee ?? Math.round(booking.amount * 0.1);
    current.bookings += 1;
    monthlyMap.set(key, current);
  }

  const monthlyHistory = Array.from(monthlyMap.values()).sort((a, b) =>
    b.month.localeCompare(a.month)
  );

  return {
    totalEarnings,
    earningsThisMonth,
    totalFees,
    monthlyHistory,
  };
}
