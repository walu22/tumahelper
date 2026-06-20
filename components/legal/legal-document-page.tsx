import Link from "next/link";
import type { LegalDocument } from "@/lib/legal/types";
import { LEGAL_SITE } from "@/lib/legal/site";

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <Link href="/" className="text-sm text-primary hover:underline mb-8 inline-block">
          ← Back to home
        </Link>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
          Legal
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-balance mb-3">
          {document.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: {LEGAL_SITE.lastUpdated}
        </p>

        <div className="space-y-5 text-muted-foreground leading-relaxed mb-12">
          {document.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="space-y-10">
          {document.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                {section.title}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-12 pt-8 border-t border-border">
          Questions? Email{" "}
          <a
            href={`mailto:${LEGAL_SITE.contactEmail}`}
            className="text-primary hover:underline"
          >
            {LEGAL_SITE.contactEmail}
          </a>
          .
        </p>
      </main>
    </div>
  );
}
