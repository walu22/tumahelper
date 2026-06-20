export interface PaymentAccountDetails {
  airtelNumber: string;
  accountName: string;
  isDemo: boolean;
}

function formatZambianMobile(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return number.trim();
}

/** Customer-facing Airtel Money details (configure in production via env). */
export function getPaymentAccountDetails(): PaymentAccountDetails {
  const rawNumber =
    process.env.NEXT_PUBLIC_AIRTEL_MONEY_NUMBER?.trim() || "0972826732";
  const airtelNumber = formatZambianMobile(rawNumber);
  const accountName = process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME?.trim() || "";

  const isDemo = rawNumber.replace(/\D/g, "") === "0970000000";

  return { airtelNumber, accountName, isDemo };
}
