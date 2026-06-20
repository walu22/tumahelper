import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { TERMS_OF_SERVICE } from "@/lib/legal/terms-content";

export const metadata: Metadata = {
  title: "Terms of Service | TumaHelper",
  description: TERMS_OF_SERVICE.description,
};

export default function TermsPage() {
  return <LegalDocumentPage document={TERMS_OF_SERVICE} />;
}
