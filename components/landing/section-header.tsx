interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl mb-12 ${alignment} ${className}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
