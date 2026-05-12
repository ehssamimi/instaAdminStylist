"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { DashboardOverviewRange } from "@/models/adminDashboard";
import type { ReferralSourceDatum } from "@/models/dashboardOverview";

const chartConfig = {
  count: {
    label: "Responses",
    color: "var(--color-brand-800)",
  },
} satisfies ChartConfig;

/** Maps the smallest count in the series to brand-200 and the largest to brand-800 (theme tokens). */
function brandBarFill(count: number, min: number, max: number): string {
  if (max <= min) {
    return "var(--color-brand-500)";
  }
  const t = Math.max(0, Math.min(1, (count - min) / (max - min)));
  const pct = (t * 100).toFixed(2);
  return `color-mix(in srgb, var(--color-brand-800) ${pct}%, var(--color-brand-200))`;
}

function withBarFills(data: ReferralSourceDatum[]): (ReferralSourceDatum & {
  fill: string;
})[] {
  if (data.length === 0) return [];
  const counts = data.map((d) => d.count);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  return data.map((d) => ({
    ...d,
    fill: brandBarFill(d.count, min, max),
  }));
}

/** Tabs: straight underline via inset shadow (avoids rounded-corner “hook” from border-b on ToggleGroupItem). */
const rangeToggleItemClassName =
  "rounded-none first:rounded-none last:rounded-none border-0 bg-transparent px-4 py-7 shadow-none " +
  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 " +
  "data-[state=on]:bg-transparent " +
  "data-[state=off]:text-muted-foreground data-[state=on]:text-brand-700 data-[state=on]:font-bold " +
  "data-[state=on]:shadow-[inset_0_-2px_0_0_var(--color-brand-700)]";

const RANGE_OPTIONS: { value: DashboardOverviewRange; label: string }[] = [
  { value: "past_week", label: "Past Week" },
  { value: "3m", label: "Past 3 Months" },
  { value: "6m", label: "Past 6 Months" },
  { value: "1y", label: "Past Year" },
];

type ChartReferralSourcesProps = {
  referralSources: ReferralSourceDatum[];
  totalResponses: number;
  range: DashboardOverviewRange;
  onRangeChange: (next: DashboardOverviewRange) => void;
  loading?: boolean;
};

export function ChartReferralSources({
  referralSources,
  totalResponses,
  range,
  onRangeChange,
  loading = false,
}: ChartReferralSourcesProps) {
  const [isDesktop, setIsDesktop] = React.useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true
  );

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const chartData = React.useMemo(
    () => withBarFills(referralSources),
    [referralSources]
  );

  const selectLabel =
    RANGE_OPTIONS.find((o) => o.value === range)?.label ?? "Past Week";

  return (
    <Card className="@container/card shadow-none py-[12px]">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <CardTitle className="text-base font-bold text-gray-900">
          How did users hear about Instastylin?{" "}
          <span className="font-bold">
            · {totalResponses.toLocaleString()} responses
          </span>
        </CardTitle>
        <div className="flex items-center">
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(v) => {
              if (v && !loading) onRangeChange(v as DashboardOverviewRange);
            }}
            variant="default"
            disabled={loading}
            className="hidden @[767px]/card:flex @[767px]/card:gap-0 @[767px]/card:rounded-none @[767px]/card:bg-transparent @[767px]/card:shadow-none"
          >
            {RANGE_OPTIONS.map((o) => (
              <ToggleGroupItem
                key={o.value}
                value={o.value}
                className={rangeToggleItemClassName}
              >
                {o.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select
            value={range}
            onValueChange={(v) => {
              if (!loading) onRangeChange(v as DashboardOverviewRange);
            }}
            disabled={loading}
          >
            <SelectTrigger
              className="flex w-44 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Time range"
            >
              <SelectValue placeholder={selectLabel} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {RANGE_OPTIONS.map((o) => (
                <SelectItem
                  key={o.value}
                  value={o.value}
                  className="rounded-lg"
                >
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-2 px-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 28, right: 8, left: 8, bottom: 0 }}
            barCategoryGap="10%"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={isDesktop ? 8 : 4}
              interval={0}
              height={isDesktop ? 32 : 64}
              angle={isDesktop ? 0 : -35}
              textAnchor={isDesktop ? "middle" : "end"}
              tick={{ fontSize: 12, fill: "#A4A7AE", fontFamily: "Satoshi", fontWeight: 400 }}
            />
            <YAxis hide domain={[0, "dataMax"]} />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
              content={<ChartTooltipContent hideIndicator />}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={112}>
              <LabelList
                dataKey="count"
                position="top"
                offset={12}
                className="fill-muted-foreground text-[16px] font-medium"
                formatter={(v: number) => v.toLocaleString()}
              />
              {chartData.map((entry, i) => (
                <Cell key={`${entry.label}-${i}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
