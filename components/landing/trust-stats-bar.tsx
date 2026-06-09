import { Clock, ShieldCheck, Star, Users } from "lucide-react";

interface TrustStatsBarProps {
  workerCount?: number | null;
  reviewCount?: number | null;
  averageRating?: number | null;
}

const defaultStats = [
  { icon: Users, label: "Verified workers", value: "100+" },
  { icon: Star, label: "Average rating", value: "4.8★" },
  { icon: Clock, label: "Full-time matching", value: "48 hours" },
  { icon: ShieldCheck, label: "Background checked", value: "Every profile" },
];

export function TrustStatsBar({
  workerCount,
  reviewCount,
  averageRating,
}: TrustStatsBarProps) {
  const stats = [
    {
      icon: Users,
      label: "Verified workers",
      value: workerCount && workerCount > 0 ? `${workerCount}+` : "100+",
    },
    {
      icon: Star,
      label: "Average rating",
      value: averageRating && averageRating > 0 ? `${averageRating.toFixed(1)}★` : "4.8★",
    },
    {
      icon: Clock,
      label: "Full-time matching",
      value: "48 hours",
    },
    {
      icon: ShieldCheck,
      label: "Customer reviews",
      value: reviewCount && reviewCount > 0 ? `${reviewCount}+` : "Trusted",
    },
  ];

  return (
    <section className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {(workerCount || reviewCount || averageRating ? stats : defaultStats).map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-display font-bold text-foreground leading-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
