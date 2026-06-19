export interface PaymentAccountDetails {
  mtnNumber: string;
  airtelNumber: string;
  accountName: string;
  isDemo: boolean;
}

/** Customer-facing mobile money details (configure in production via env). */
export function getPaymentAccountDetails(): PaymentAccountDetails {
  const mtnNumber =
    process.env.NEXT_PUBLIC_MTN_MOMO_NUMBER?.trim() || "097 000 0000";
  const airtelNumber =
    process.env.NEXT_PUBLIC_AIRTEL_MONEY_NUMBER?.trim() || "097 000 0001";
  const accountName =
    process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME?.trim() || "TumaHelper Ltd";

  const isDemo =
    mtnNumber === "097 000 0000" &&
    airtelNumber === "097 000 0001" &&
    accountName === "TumaHelper Ltd";

  return { mtnNumber, airtelNumber, accountName, isDemo };
}
