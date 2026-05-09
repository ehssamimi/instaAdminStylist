"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type {
  PerformanceRange,
  PerformancesResponse,
} from "@/models/adminDashboard";

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--color-brand-700)",
  },
} satisfies ChartConfig;

type MetricKey = "totalSales" | "totalRevenue";

const METRIC_OPTIONS: { value: MetricKey; label: string }[] = [
  { value: "totalSales", label: "Total Sales" },
  { value: "totalRevenue", label: "Total Revenue" },
];

const RANGE_OPTIONS: { value: PerformanceRange; label: string }[] = [
  { value: "6m", label: "6 months" },
  { value: "30d", label: "30 days" },
  { value: "7d", label: "7 days" },
];

const metricTabClassName =
  "rounded-[8px] first:rounded-[8px] last:rounded-[8px] border-0 px-3 py-2 text-[11px] font-bold leading-[130%] shadow-none " +
  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 " +
  "data-[state=off]:bg-transparent data-[state=off]:text-[#A4A7AE] " +
  "data-[state=on]:bg-white data-[state=on]:border data-[state=on]:border-[#E9EAEB] data-[state=on]:text-[#414651]";

const rangeTabClassName =
  "rounded-[8px] first:rounded-[8px] last:rounded-[8px] border-0 px-3 py-2 text-[11px] font-bold leading-[130%] shadow-none " +
  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 " +
  "data-[state=off]:bg-transparent data-[state=off]:text-[#A4A7AE] " +
  "data-[state=on]:bg-white data-[state=on]:border data-[state=on]:border-[#E9EAEB] data-[state=on]:text-[#414651]";

type ChartAreaInteractiveProps = {
  data: PerformancesResponse | null;
  loading?: boolean;
  range: PerformanceRange;
  onRangeChange: (r: PerformanceRange) => void;
};

export function ChartAreaInteractive({
  data,
  loading = false,
  range,
  onRangeChange,
}: ChartAreaInteractiveProps) {
  const [metric, setMetric] = React.useState<MetricKey>("totalSales");

  const rawPoints = data?.[metric]?.dataPoints ?? [];

  const chartData = React.useMemo(
    () =>
      rawPoints.map((p) => ({
        date: p.date,
        value: Math.max(0, Number(p.value)),
      })),
    [rawPoints]
  );

  const allZeros =
    chartData.length > 0 && chartData.every((p) => p.value === 0);

  const { yMax, ticks } = React.useMemo(() => {
    const maxVal =
      chartData.length > 0 ? Math.max(...chartData.map((p) => p.value)) : 0;
    if (maxVal <= 0) {
      return { yMax: 100, ticks: [0, 25, 50, 75, 100] as number[] };
    }
    const padded = maxVal * 1.15;
    const yMaxRounded = Math.max(50, Math.ceil(padded / 50) * 50);
    const step = yMaxRounded / 4;
    const tickList = Array.from(
      { length: 5 },
      (_, i) => Math.round(i * step * 100) / 100
    );
    return { yMax: yMaxRounded, ticks: tickList };
  }, [chartData]);

  return (
    <Card className="@container/card shadow-none">
      <div className="flex flex-col gap-3 px-6 ">
        <h3 className="text-base font-bold text-gray-900">Performance</h3>
        <div className="flex items-center justify-between">
          <ToggleGroup
            type="single"
            value={metric}
            onValueChange={(v) => {
              if (v) setMetric(v as MetricKey);
            }}
            variant="default"
            className="gap-1 rounded-[8px] border border-[#E9EAEB] bg-[#F5F5F5] p-0 shadow-none"
          >
            {METRIC_OPTIONS.map((o) => (
              <ToggleGroupItem
                key={o.value}
                value={o.value}
                className={metricTabClassName}
              >
                {o.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(v) => {
              if (v && !loading) onRangeChange(v as PerformanceRange);
            }}
            variant="default"
            disabled={loading}
            className="gap-1 rounded-[8px] border border-[#E9EAEB] bg-[#F5F5F5] p-0 shadow-none"
          >
            {RANGE_OPTIONS.map((o) => (
              <ToggleGroupItem
                key={o.value}
                value={o.value}
                className={rangeTabClassName}
              >
                {o.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="h-[250px] animate-pulse rounded-xl bg-muted" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full [&_.recharts-cartesian-axis-tick_text]:!fill-gray-400"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-value)"
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-value)"
                    stopOpacity={0.0003}
                  />
                </linearGradient>
                <filter
                  id="valueLineShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="2"
                    floodColor="#000000"
                    floodOpacity="0.24"
                  />
                </filter>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                padding={{ left: 30, right: 10 }}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: "var(--color-gray-400)", fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={72}
                tickMargin={14}
                domain={[0, yMax]}
                ticks={ticks}
                tick={{
                  fill: "var(--color-gray-400)",
                  fontSize: 12,
                  width: 300,
                }}
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="value"
                type="linear"
                baseLine={0}
                fill="url(#fillValue)"
                fillOpacity={1}
                stroke="#111111"
                strokeWidth={allZeros ? 2 : 1.6}
                filter="url(#valueLineShadow)"
                dot={
                  allZeros
                    ? {
                        r: 2.5,
                        stroke: "#111111",
                        strokeWidth: 2,
                        fill: "#111111",
                      }
                    : false
                }
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
