"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import type { DashboardChartRange, SalesByRange } from '@/models/dashboardOverview'

export const description = "An interactive area chart"

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--color-brand-700)",
  },
} satisfies ChartConfig

type ChartAreaInteractiveProps = {
  salesByRange: SalesByRange
}

const rangeToggleItemClassName =
  "rounded-none first:rounded-none last:rounded-none border-0 bg-transparent px-4 py-7 shadow-none " +
  "hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 " +
  "data-[state=on]:bg-transparent " +
  "data-[state=off]:text-muted-foreground data-[state=on]:text-brand-700 data-[state=on]:font-bold " +
  "data-[state=on]:shadow-[inset_0_-2px_0_0_var(--color-brand-700)]"

export function ChartAreaInteractive({ salesByRange }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<DashboardChartRange>('90d')

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d')
    }
  }, [isMobile])

  const metricsData = React.useMemo(
    () => salesByRange[timeRange] ?? salesByRange['7d'],
    [salesByRange, timeRange]
  )

  return (
    <Card className="@container/card shadow-none ">
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v) => v && setTimeRange(v as DashboardChartRange)}
            variant="default"
            className="hidden @[767px]/card:flex @[767px]/card:gap-0 @[767px]/card:rounded-none @[767px]/card:bg-transparent @[767px]/card:shadow-none"
          >
            <ToggleGroupItem value="7d" className={rangeToggleItemClassName}>
              Past Week
            </ToggleGroupItem>
            <ToggleGroupItem value="90d" className={rangeToggleItemClassName}>
              Past 3 Months
            </ToggleGroupItem>
            <ToggleGroupItem value="180d" className={rangeToggleItemClassName}>
              Past 6 Months
            </ToggleGroupItem>
            <ToggleGroupItem value="365d" className={rangeToggleItemClassName}>
              Past Year
            </ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as DashboardChartRange)}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="365d" className="rounded-lg">
                Last 12 months
              </SelectItem>
              <SelectItem value="180d" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full [&_.recharts-cartesian-axis-tick_text]:!fill-gray-400"
        >
          <AreaChart data={metricsData}>
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
              domain={[0, 2000]}
              ticks={[0, 500, 1000, 1500, 2000]}
              tick={{ fill: "var(--color-gray-400)", fontSize: 12, width: 300 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
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
              type="natural"
              fill="url(#fillSales)"
              fillOpacity={1}
              stroke="#111111"
              strokeWidth={1.6}
              filter="url(#salesLineShadow)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
