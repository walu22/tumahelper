const items = [
  "NRC verified workers",
  "Reference checked",
  "Trust scores & reviews",
  "Lusaka based",
  "48-hour guarantee",
  "Book or hire full-time",
  "Mobile money ready",
  "Worker dignity first",
];

export function TrustMarquee() {
  const doubled = [...items, ...items];

  return (
    <section className="bg-forest text-cream py-4 overflow-hidden border-y border-white/10">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center mx-8 text-sm font-medium tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-accent mr-3 shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
