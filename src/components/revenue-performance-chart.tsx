"use client"

import * as React from "react"
import { format, parseISO, isValid } from "date-fns"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { EachContainer } from "@/components/each-container"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { revenueYAxisUpperBound } from "@/lib/revenue-dashboard"
import type { SalesDataPoint } from "@/models/dashboardOverview"

const chartConfig = {
  sales: {
    label: "Revenue",
    color: "var(--color-brand-700)",
  },
} satisfies ChartConfig

function formatTickDate(value: string): string {
  const d = parseISO(value)
  if (!isValid(d)) return value
  return `${format(d, "MMM")}. ${format(d, "d")}`
}

export type RevenuePerformanceChartProps = {
  data: SalesDataPoint[]
  title?: string
}

export function RevenuePerformanceChart({
  data,
  title = "Performance",
}: RevenuePerformanceChartProps) {
  const defsId = React.useId().replace(/:/g, "")
  const fillGradientId = `${defsId}-fillSales`
  const lineShadowFilterId = `${defsId}-salesLineShadow`

  const yMax = React.useMemo(() => {
    const maxVal = Math.max(0, ...data.map((d) => d.sales))
    return revenueYAxisUpperBound(maxVal)
  }, [data])

  const yTicks = React.useMemo(() => {
    const step = 500
    const ticks: number[] = []
    for (let v = 0; v <= yMax; v += step) ticks.push(v)
    return ticks
  }, [yMax])

  return (
    <EachContainer title={title} className="mt-0">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[280px] w-full [&_.recharts-cartesian-axis-tick_text]:!fill-gray-400"
      >
        <AreaChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
          <defs>
            <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="1%"
                stopColor="var(--color-sales)"
                stopOpacity={0.1}
              />
              <stop
                offset="60%"
                stopColor="var(--color-sales)"
                stopOpacity={0.0003}
              />
            </linearGradient>
            <filter
              id={lineShadowFilterId}
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
            tickMargin={10}
            minTickGap={24}
            angle={-35}
            textAnchor="end"
            height={56}
            tick={{ fill: "var(--color-gray-400)", fontSize: 11 }}
            tickFormatter={formatTickDate}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={56}
            tickMargin={8}
            domain={[0, yMax]}
            ticks={yTicks}
            tick={{ fill: "var(--color-gray-400)", fontSize: 12 }}
            tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
                labelFormatter={(value) => formatTickDate(String(value))}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="sales"
            type="natural"
            fill={`url(#${fillGradientId})`}
            fillOpacity={1}
            stroke="#111111"
            strokeWidth={1.6}
            filter={`url(#${lineShadowFilterId})`}
          />
        </AreaChart>
      </ChartContainer>
    </EachContainer>
  )
}
