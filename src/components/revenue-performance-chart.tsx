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

  const chartData = React.useMemo(
    () => data.map((d) => ({ ...d, sales: Math.max(0, d.sales) })),
    [data]
  )

  const { yMax, yTicks } = React.useMemo(() => {
    const maxVal = chartData.length > 0 ? Math.max(...chartData.map((d) => d.sales)) : 0
    if (maxVal <= 0) {
      return { yMax: 500, yTicks: [0, 125, 250, 375, 500] as number[] }
    }
    const padded = maxVal * 1.15
    const yMaxRounded = Math.max(50, Math.ceil(padded / 50) * 50)
    const step = yMaxRounded / 4
    const ticks = Array.from({ length: 5 }, (_, i) => Math.round(i * step * 100) / 100)
    return { yMax: yMaxRounded, yTicks: ticks }
  }, [chartData])

  return (
    <EachContainer title={title} className="mt-0">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[280px] w-full [&_.recharts-cartesian-axis-tick_text]:!fill-gray-400"
      >
        <AreaChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
          <defs>
            <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-sales)"
                stopOpacity={0.18}
              />
              <stop
                offset="80%"
                stopColor="var(--color-sales)"
                stopOpacity={0.04}
              />
              <stop
                offset="100%"
                stopColor="var(--color-sales)"
                stopOpacity={0}
              />
            </linearGradient>
            <filter
              id={lineShadowFilterId}
              x="-20%"
              y="-30%"
              width="140%"
              height="160%"
            >
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="4"
                floodColor="#000000"
                floodOpacity="0.12"
              />
            </filter>
          </defs>
          <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="0" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            padding={{ left: 30, right: 10 }}
            tickMargin={8}
            minTickGap={32}
            tick={{ fill: "#A4A7AE", fontSize: 12, fontFamily: "Satoshi", fontWeight: 400 }}
            tickFormatter={formatTickDate}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickMargin={4}
            domain={[0, yMax]}
            ticks={yTicks}
            tick={{ fill: "#A4A7AE", fontSize: 12, fontFamily: "Satoshi", fontWeight: 400 }}
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
            type="monotone"
            fill={`url(#${fillGradientId})`}
            fillOpacity={1}
            stroke="#1a1a1a"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${lineShadowFilterId})`}
            animationDuration={700}
            animationEasing="ease-out"
            activeDot={{
              r: 5,
              stroke: "#ffffff",
              strokeWidth: 2,
              fill: "#1a1a1a",
            }}
          />
        </AreaChart>
      </ChartContainer>
    </EachContainer>
  )
}
