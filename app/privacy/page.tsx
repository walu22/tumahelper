import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { PRIVACY_POLICY } from "@/lib/legal/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy | TumaHelper",
  description: PRIVACY_POLICY.description,
};

export default function PrivacyPage() {
  return <LegalDocumentPage document={PRIVACY_POLICY} />;
}
