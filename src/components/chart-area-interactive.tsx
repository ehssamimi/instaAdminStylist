"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { SalesDataPoint } from '@/models/dashboardOverview'

export const description = "An interactive area chart"

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--color-brand-700)",
  },
} satisfies ChartConfig

type ChartAreaInteractiveProps = {
  performance: SalesDataPoint[]
}

export function ChartAreaInteractive({ performance }: ChartAreaInteractiveProps) {
  /** Revenue is never negative in the UI; clamp so the line stays on/above $0. */
  const chartData = React.useMemo(
    () =>
      performance.map((p) => ({
        ...p,
        sales: Math.max(0, Number(p.sales)),
      })),
    [performance]
  )

  const allZeros =
    chartData.length > 0 && chartData.every((p) => p.sales === 0)

  const { yMax, ticks } = React.useMemo(() => {
    const maxVal =
      chartData.length > 0 ? Math.max(...chartData.map((p) => p.sales)) : 0
    if (maxVal <= 0) {
      return { yMax: 100, ticks: [0, 25, 50, 75, 100] as number[] }
    }
    const padded = maxVal * 1.15
    const yMaxRounded = Math.max(50, Math.ceil(padded / 50) * 50)
    const step = yMaxRounded / 4
    const tickList = Array.from(
      { length: 5 },
      (_, i) => Math.round(i * step * 100) / 100
    )
    return { yMax: yMaxRounded, ticks: tickList }
  }, [chartData])

  return (
    <Card className="@container/card shadow-none ">
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full [&_.recharts-cartesian-axis-tick_text]:!fill-gray-400"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.0003}
                />
              </linearGradient>
              <filter id="salesLineShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.24" />
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
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={72}
              tickMargin={14}
              domain={[0, yMax]}
              ticks={ticks}
              tick={{ fill: "var(--color-gray-400)", fontSize: 12, width: 300 }}
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
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="sales"
              type="linear"
              baseLine={0}
              fill="url(#fillSales)"
              fillOpacity={1}
              stroke="#111111"
              strokeWidth={allZeros ? 2 : 1.6}
              filter="url(#salesLineShadow)"
              dot={
                allZeros
                  ? { r: 2.5, stroke: "#111111", strokeWidth: 2, fill: "#111111" }
                  : false
              }
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
