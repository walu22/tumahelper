import { BarChart3, CalendarCheck, DollarSign, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminAnalyticsData } from "@/lib/admin/analytics-data";
import { formatCurrency } from "@/lib/utils";

const METRIC_ICONS: LucideIcon[] = [Users, CalendarCheck, DollarSign, TrendingUp];

export function AdminAnalyticsOverview({ data }: { data: AdminAnalyticsData }) {
  const maxBookings = Math.max(...data.monthlyTrend.map((month) => month.bookings), 1);
  const maxRevenue = Math.max(...data.monthlyTrend.map((month) => month.revenue), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => {
          const Icon = METRIC_ICONS[index] ?? BarChart3;
          return (
            <Card key={metric.label} className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-display text-2xl font-bold tracking-tight">{metric.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminTrendChart
          title="Bookings (6 months)"
          description="New bookings created each month"
          months={data.monthlyTrend}
          valueKey="bookings"
          maxValue={maxBookings}
          formatValue={(value) => String(value)}
        />
        <AdminTrendChart
          title="Revenue (6 months)"
          description="Confirmed payment totals by month"
          months={data.monthlyTrend}
          valueKey="revenue"
          maxValue={maxRevenue}
          formatValue={(value) => formatCurrency(value)}
        />
      </div>
    </div>
  );
}

function AdminTrendChart({
  title,
  description,
  months,
  valueKey,
  maxValue,
  formatValue,
}: {
  title: string;
  description: string;
  months: AdminAnalyticsData["monthlyTrend"];
  valueKey: "bookings" | "revenue";
  maxValue: number;
  formatValue: (value: number) => string;
}) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex h-52 items-end gap-3">
          {months.map((month) => {
            const value = month[valueKey];
            const height = Math.max(8, Math.round((value / maxValue) * 100));
            return (
              <div key={month.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-foreground">{formatValue(value)}</span>
                <div className="flex h-36 w-full items-end">
                  <div
                    className="w-full rounded-t-lg bg-primary/80 transition-all"
                    style={{ height: `${height}%` }}
                    title={`${month.label}: ${formatValue(value)}`}
                  />
                </div>
                <span className="truncate text-[11px] text-muted-foreground">{month.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
