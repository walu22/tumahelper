import type { Metadata } from "next";
import { ComingSoonScreen } from "@/components/coming-soon/coming-soon-screen";

export const metadata: Metadata = {
  title: "Coming Soon | TumaHelper",
  description:
    "TumaHelper is launching soon. Trusted home help in Lusaka — cleaning, childcare, repairs, and more.",
  robots: { index: true, follow: true },
};

export default function ComingSoonPage() {
  return <ComingSoonScreen />;
}
