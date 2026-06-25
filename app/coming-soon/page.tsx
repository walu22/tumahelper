import type { Metadata } from "next";
import { ComingSoonScreen } from "@/components/coming-soon/coming-soon-screen";

export const metadata: Metadata = {
  title: "Coming Soon | TumaHelper",
  description:
    "Home help in Lusaka, without the stress. Soon you'll be able to book verified helpers for cleaning, childcare, cooking, laundry, garden work, and home repairs.",
  robots: { index: true, follow: true },
};

export default function ComingSoonPage() {
  return <ComingSoonScreen />;
}
